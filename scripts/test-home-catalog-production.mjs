import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import { cp, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// Run after npm run build. All mutations use this local fixture API only.
// ISR writes generated HTML to disk, so never run fixtures in the deployable build.
const runtimeParent = path.resolve(".next");
const runtimeDirectory = await mkdtemp(path.join(runtimeParent, "home-revalidation-test-"));
assert.equal(path.dirname(runtimeDirectory), runtimeParent);
assert.ok(path.basename(runtimeDirectory).startsWith("home-revalidation-test-"));
try {
  await cp(path.resolve(".next/standalone"), runtimeDirectory, { recursive: true });
} catch (error) {
  await rm(runtimeDirectory, { recursive: true, force: true });
  throw error;
}
let title = "Fixture old title";
let childName = "Fixture old child";
let postTitle = "Fixture old post";
let catalogLoads = 0;
let postLoads = 0;
const catalogQueries = new Set();
const category = { id: "root", name: "Fixture root", slug: "fixture-root", parentId: null };
const getItems = () => Array.from({ length: 51 }, (_, index) => ({
  id: `fixture-${index}`, websiteId: "fixture-site", slug: `fixture-${index}`,
  title: index === 0 ? title : `Fixture product ${index}`,
  categoryId: "child", category: { id: "child", name: childName, slug: "fixture-child" },
  thumbnailUrl: null, price: null, status: "PUBLISHED",
}));
const getPost = () => ({
  id: "fixture-post", slug: "fixture-post", title: postTitle,
  excerpt: "Fixture news excerpt", content: "Fixture news content",
  thumbnailUrl: null, status: "PUBLISHED", publishedAt: "2026-10-01T00:00:00Z",
});
const api = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  let payload = { success: true, data: [] };
  if (url.pathname === "/api/public/catalog") {
    catalogLoads += 1;
    const limit = Math.min(Number(url.searchParams.get("limit") || 12), 50);
    const page = Number(url.searchParams.get("page") || 1);
    catalogQueries.add(`${page}:${limit}`);
    payload = { success: true, data: getItems().slice((page - 1) * limit, page * limit),
      meta: { page, limit, total: 51, totalPages: Math.ceil(51 / limit) } };
  } else if (url.pathname === "/api/public/catalog/categories") {
    payload.data = [category, { id: "child", name: childName, slug: "fixture-child", parentId: "root" }];
  } else if (url.pathname === "/api/public/catalog/fixture-0") {
    payload.data = getItems()[0];
  } else if (url.pathname === "/api/public/site") {
    payload.data = { siteName: "Local fixture", hotline: "0900000000", contact: { hotline: "0900000000" } };
  } else if (url.pathname === "/api/public/redirects") {
    payload.data = { redirect: null };
  } else if (url.pathname === "/api/public/posts") {
    postLoads += 1;
    payload.data = [getPost()];
  } else if (url.pathname === "/api/public/posts/fixture-post") {
    payload.data = getPost();
  } else if (url.pathname.startsWith("/api/public/posts/")) {
    response.statusCode = 404;
  }
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(payload));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const apiUrl = `http://127.0.0.1:${api.address().port}`;
const portProbe = createServer();
portProbe.listen(0, "127.0.0.1");
await once(portProbe, "listening");
const port = portProbe.address().port;
await new Promise((resolve) => portProbe.close(resolve));
const website = `http://127.0.0.1:${port}`;
const secret = randomUUID();
const siteKey = randomUUID();
const child = spawn(process.execPath, [path.join(runtimeDirectory, "server.js")], {
  cwd: runtimeDirectory, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NODE_ENV: "production", HOSTNAME: "127.0.0.1", PORT: String(port),
    API_BASE_URL: apiUrl, NEXT_PUBLIC_API_BASE_URL: apiUrl, PUBLIC_API_BASE_URL: apiUrl,
    PUBLIC_SITE_KEY: siteKey, NEXT_PUBLIC_SITE_KEY: siteKey,
    REVALIDATION_SECRET: secret, FRONTEND_REVALIDATE_SECRET: secret,
    FRONTEND_REVALIDATION_PROTOCOL: "v2" },
});
let serverLog = "";
child.stdout.on("data", (data) => { serverLog = (serverLog + data).slice(-8_000); });
child.stderr.on("data", (data) => { serverLog = (serverLog + data).slice(-8_000); });
async function readPage(path = "/") {
  const response = await fetch(website + path);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  assert.equal(response.status, 200, `${path}: ${serverLog}`);
  return { html, cacheControl: response.headers.get("cache-control"), cache: response.headers.get("x-nextjs-cache") };
}
async function sendWebhook({ event, module, entityType, slug, tags = [] }) {
  const timestamp = String(Date.now());
  const body = JSON.stringify({ eventId: randomUUID(), websiteId: "fixture-site",
    event, module, paths: [], tags, scopes: [], source: "dashboard-admin", timestamp,
    meta: { contractVersion: "frontend-revalidation-v2", entityType, slug } });
  const response = await fetch(website + "/api/revalidate", { method: "POST", body,
    headers: { "content-type": "application/json", "x-public-site-key": siteKey,
      "x-revalidate-timestamp": timestamp,
      "x-revalidate-signature": createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex") } });
  const ack = await response.json();
  assert.equal(response.status, 200, JSON.stringify(ack));
  assert.ok(ack.acceptedPaths.includes("/"), "Webhook must invalidate the homepage");
  return ack;
}
async function waitForHome(expectedTitle, expectedChild, expectedPost) {
  // Next.js may serve one STALE response while regenerating the cached HTML.
  let lastState;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const page = await readPage();
    lastState = { cache: page.cache, product: page.html.includes(expectedTitle),
      category: page.html.includes(expectedChild), post: page.html.includes(expectedPost) };
    if (page.cache === "HIT" && page.html.includes(expectedTitle)
      && page.html.includes(expectedChild) && page.html.includes(expectedPost)) return;
    await delay(100);
  }
  assert.fail(`Homepage did not regenerate: ${JSON.stringify(lastState)} ${serverLog}`);
}
async function checkBatch(expectedTitle, expectedChild, expectedPost) {
  const beforeCatalogLoads = catalogLoads;
  const beforePostLoads = postLoads;
  const pages = await Promise.all(Array.from({ length: 20 }, () => readPage()));
  for (const page of pages) {
    assert.ok(page.html.includes(expectedTitle), "Rendered product card must have the current title");
    assert.ok(page.html.includes(expectedChild), "Child filter must have the current name");
    assert.ok(page.html.includes(expectedPost), "News card must have the current post title");
    assert.equal((page.html.match(/<a\b[^>]*href="\/san-pham\/fixture-\d+"[^>]*>/g) ?? []).length, 10,
      "Homepage collection must render no more than ten product cards");
    assert.ok(!page.html.includes("Fixture product 50"), "Extra product cards must not render on the homepage");
    assert.ok((page.html.match(/<a\b[^>]*aria-label="Xem thêm sản phẩm Fixture root"[^>]*>/g) ?? [])
      .some((link) => link.includes('href="/danh-muc/fixture-root"')),
      "View more must link to the collection category");
    assert.ok(page.cacheControl?.includes("s-maxage="), "Homepage must use shared HTML cache like CTF");
    assert.ok(!page.cacheControl?.includes("no-store"), "Homepage must not disable HTML cache");
    assert.equal(page.cache, "HIT", "Repeat visits must use Next.js HTML cache");
  }
  assert.equal(catalogLoads, beforeCatalogLoads, "20 cached visits must not reload products");
  assert.equal(postLoads, beforePostLoads, "20 cached visits must not reload posts");
}
try {
  let ready = false;
  for (let attempts = 0; attempts < 100; attempts += 1) {
    try { await fetch(website + "/api/revalidate"); ready = true; break; } catch { await delay(100); }
  }
  assert.ok(ready, `Production server did not start: ${serverLog}`);
  // Replace prerendered build-time data with this isolated fixture's data.
  await sendWebhook({ event: "manual.full-site.revalidate", module: "site" });
  await waitForHome(title, childName, postTitle);
  assert.ok(catalogQueries.has("2:50"), "Homepage must fetch the second page, not truncate the catalog at 50 products");
  const initialCatalogLoads = catalogLoads;
  const initialPostLoads = postLoads;
  await checkBatch(title, childName, postTitle);
  assert.equal(catalogLoads, initialCatalogLoads, "20 cached visits must not reload products");
  assert.equal(postLoads, initialPostLoads, "20 cached visits must not reload posts");

  const oldPostTitle = postTitle;
  postTitle = "Fixture revalidated post";
  await delay(5_100);
  const cachedPostPage = await readPage();
  assert.equal(cachedPostPage.cache, "HIT");
  assert.ok(cachedPostPage.html.includes(oldPostTitle), "Editing API data alone must leave HTML cached");
  assert.ok(!cachedPostPage.html.includes(postTitle));
  const postAck = await sendWebhook({ event: "post.updated", module: "posts", entityType: "post", slug: "fixture-post" });
  assert.ok(postAck.acceptedTags.includes("posts"));
  assert.ok(!postAck.acceptedTags.includes("catalog"), "Post event must not invalidate product data");
  await waitForHome(title, childName, postTitle);
  await checkBatch(title, childName, postTitle);
  // In Next 13, revalidatePath('/') can also expire implicit fetch dependencies
  // of the homepage. Only repeated cached visits must avoid extra API calls.

  const oldTitle = title;
  title = "Fixture revalidated catalog title";
  childName = "Fixture revalidated child";
  const cachedProductPage = await readPage();
  assert.equal(cachedProductPage.cache, "HIT");
  assert.ok(cachedProductPage.html.includes(oldTitle));
  assert.ok(!cachedProductPage.html.includes(title), "Product edits must also wait for a webhook");
  const catalogAck = await sendWebhook({ event: "catalog.updated", module: "catalog",
    entityType: "catalog-item", slug: "fixture-0", tags: ["catalog"] });
  assert.ok(catalogAck.acceptedTags.includes("catalog"));
  await waitForHome(title, childName, postTitle);
  const catalogLoadsAfterRefresh = catalogLoads;
  await checkBatch(title, childName, postTitle);
  assert.equal(catalogLoads, catalogLoadsAfterRefresh, "20 cached visits after revalidation must not reload products");
  for (const path of ["/danh-muc", "/san-pham/fixture-0", "/bai-viet/fixture-post"]) {
    let updated = false;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const page = await readPage(path);
      if (page.html.includes(path.startsWith("/bai-viet") ? postTitle : title)) { updated = true; break; }
      await delay(100);
    }
    assert.ok(updated, `${path} must reflect its revalidated API data`);
  }

  title = "Fixture revalidated product alias";
  const aliasAck = await sendWebhook({ event: "product.updated", module: "products",
    entityType: "product", slug: "fixture-0" });
  assert.ok(aliasAck.acceptedTags.includes("catalog"));
  await waitForHome(title, childName, postTitle);
  await checkBatch(title, childName, postTitle);
  console.log(JSON.stringify({ result: "PASS", visitorsPerBatch: 20, products: 51,
    renderedCardsPerCollection: 10, categoryViewMoreLink: "PASS",
    cachedBatchCatalogAndPostApiCalls: 0, postWebhookRefresh: "PASS", catalogWebhookRefresh: "PASS",
    productAliasWebhookRefresh: "PASS", categoryAndDetailUpdates: "PASS",
    homepageHtmlCache: "HIT", taggedPostAndCatalogRefresh: "PASS" }, null, 2));
} finally {
  child.kill();
  if (child.exitCode === null) await Promise.race([once(child, "exit"), delay(5_000)]);
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  await rm(runtimeDirectory, { recursive: true, force: true });
}
