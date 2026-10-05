import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

// Run after npm run build. All mutations use this local fixture API only.
let title = "Fixture old title";
let childName = "Fixture old child";
let catalogLoads = 0;
const category = { id: "root", name: "Fixture root", slug: "fixture-root", parentId: null };
const getItems = () => Array.from({ length: 51 }, (_, index) => ({
  id: `fixture-${index}`, websiteId: "fixture-site", slug: `fixture-${index}`,
  title: index === 0 ? title : `Fixture product ${index}`,
  categoryId: "child", category: { id: "child", name: childName, slug: "fixture-child" },
  thumbnailUrl: null, price: null, status: "PUBLISHED",
}));
const api = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  let payload = { success: true, data: [] };
  if (url.pathname === "/api/public/catalog") {
    catalogLoads += 1;
    const limit = Math.min(Number(url.searchParams.get("limit") || 12), 50);
    const page = Number(url.searchParams.get("page") || 1);
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
const child = spawn(process.execPath, [".next/standalone/server.js"], {
  cwd: process.cwd(), windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
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
async function checkBatch(expectedTitle, expectedChild) {
  const pages = await Promise.all(Array.from({ length: 20 }, () => readPage()));
  for (const page of pages) {
    assert.ok(page.html.includes(expectedTitle), "Rendered product card must have the current title");
    assert.ok(page.html.includes(expectedChild), "Child filter must have the current name");
    assert.ok(page.html.includes("Fixture product 50"), "Products on page two must render");
    assert.ok(page.cacheControl?.includes("no-store"), "Homepage HTML must not enter ISR/CDN cache");
    assert.notEqual(page.cache, "HIT");
  }
}
try {
  let ready = false;
  for (let attempts = 0; attempts < 100; attempts += 1) {
    try { await fetch(website + "/api/revalidate"); ready = true; break; } catch { await delay(100); }
  }
  assert.ok(ready, `Production server did not start: ${serverLog}`);
  const initialLoads = catalogLoads;
  await checkBatch(title, childName);
  assert.equal(catalogLoads - initialLoads, 2, "20 visitors must share two paginated API calls");

  title = "Fixture updated title";
  childName = "Fixture updated child";
  for (const path of ["/danh-muc", "/san-pham/fixture-0"]) {
    const page = await readPage(path);
    assert.ok(page.html.includes(title), `${path} must reflect the API edit`);
  }
  await delay(5_100);
  const beforeExpiryRefresh = catalogLoads;
  await checkBatch(title, childName);
  assert.equal(catalogLoads - beforeExpiryRefresh, 2, "Expired snapshot must refresh once for 20 visitors");

  title = "Fixture webhook title";
  childName = "Fixture webhook child";
  const timestamp = String(Date.now());
  const body = JSON.stringify({ eventId: randomUUID(), websiteId: "fixture-site",
    event: "product.updated", module: "products", paths: ["/danh-muc"], tags: [], scopes: [],
    source: "dashboard-admin", timestamp,
    meta: { contractVersion: "frontend-revalidation-v2", entityType: "product", slug: "fixture-0" } });
  const response = await fetch(website + "/api/revalidate", { method: "POST", body,
    headers: { "content-type": "application/json", "x-public-site-key": siteKey,
      "x-revalidate-timestamp": timestamp,
      "x-revalidate-signature": createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex") } });
  assert.equal(response.status, 200);
  const ack = await response.json();
  assert.ok(ack.acceptedPaths.includes("/"));
  const beforeWebhookRefresh = catalogLoads;
  await checkBatch(title, childName);
  assert.equal(catalogLoads - beforeWebhookRefresh, 2, "Webhook must clear the page snapshot immediately");
  console.log(JSON.stringify({ result: "PASS", visitorsPerBatch: 20, products: 51,
    catalogApiCallsPerBatch: 2, blockingTtlRefresh: "PASS", immediateWebhookRefresh: "PASS",
    categoryAndDetailUpdates: "PASS", homepageHtmlCache: "no-store" }, null, 2));
} finally {
  child.kill();
  if (child.exitCode === null) await Promise.race([once(child, "exit"), delay(5_000)]);
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
}
