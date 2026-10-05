import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  createV2Signature,
  isFreshTimestamp,
  verifyV2Signature,
} from "../authentication";
import { parseRevalidationContract } from "../contract";
import { runRevalidationEngine } from "../engine";
import {
  handleFrontendRevalidationRequest,
  selectRequestProtocol,
} from "../handler";
import { expandRevalidationRoutes } from "../route-expansion";
import {
  CATALOG_DYNAMIC_PAGE_PATTERNS,
  PAGES_DYNAMIC_PAGE_PATTERNS,
  POSTS_DYNAMIC_PAGE_PATTERNS,
} from "../route-registry";

const VECTOR_TIMESTAMP = "1700000000000";
const VECTOR_BODY = '{"eventId":"evt-1"}';
const VECTOR_SECRET = "test-secret";
const VECTOR_SIGNATURE =
  "b2cd5720a009b9e0891489829bf1e4fbe7a5db3b6fbed7fbdff69a3ac1b13a75";

test("HMAC uses the exact raw body test vector", () => {
  assert.equal(
    createV2Signature(VECTOR_TIMESTAMP, VECTOR_BODY, VECTOR_SECRET),
    VECTOR_SIGNATURE,
  );
  assert.equal(
    verifyV2Signature({
      timestamp: VECTOR_TIMESTAMP,
      exactRawBody: VECTOR_BODY,
      secret: VECTOR_SECRET,
      signature: VECTOR_SIGNATURE,
    }),
    true,
  );
});

test("changing one raw-body character or whitespace invalidates HMAC", () => {
  assert.equal(
    verifyV2Signature({
      timestamp: VECTOR_TIMESTAMP,
      exactRawBody: `${VECTOR_BODY} `,
      secret: VECTOR_SECRET,
      signature: VECTOR_SIGNATURE,
    }),
    false,
  );
});

test("timestamp freshness accepts current and rejects expired values", () => {
  const now = 1_800_000_000_000;
  assert.equal(isFreshTimestamp(String(now), now), true);
  assert.equal(isFreshTimestamp(String(now - 5 * 60 * 1000 - 1), now), false);
});

const emptyPathCollection = async () => ({
  paths: [],
  sources: {},
  requiredStaticPaths: [],
  missingRequiredStaticPaths: [],
  errors: [],
});

function contract(meta: Record<string, unknown>, event = "catalog.updated") {
  return parseRevalidationContract({
    eventId: "evt-routes",
    websiteId: "site-1",
    event,
    module: event.startsWith("post") ? "posts" : "catalog",
    paths: [],
    tags: [],
    scopes: [],
    source: "dashboard-admin",
    timestamp: "1700000000000",
    meta: {
      contractVersion: "frontend-revalidation-v2",
      ...meta,
    },
  });
}

test("oldSlug/newSlug expansion covers catalog concrete and dynamic routes", async () => {
  const expansion = await expandRevalidationRoutes(
    contract({
      entityType: "catalog-item",
      oldSlug: "dich-vu-cu",
      newSlug: "dich-vu-moi",
    }),
    { collectPaths: emptyPathCollection },
  );

  assert.ok(expansion.paths.includes("/san-pham/dich-vu-cu"));
  assert.ok(expansion.paths.includes("/san-pham/dich-vu-moi"));
  assert.ok(expansion.paths.includes("/"));
  assert.ok(expansion.dynamicPatterns.includes("/san-pham/[slug]"));
});

test("blog/category expansion covers concrete and dynamic routes", async () => {
  const expansion = await expandRevalidationRoutes(
    contract(
      {
        entityType: "post",
        oldSlug: "bai-cu",
        newSlug: "bai-moi",
        categorySlug: "tin-tuc",
      },
      "post.updated",
    ),
    { collectPaths: emptyPathCollection },
  );

  assert.ok(expansion.paths.includes("/bai-viet/bai-cu"));
  assert.ok(expansion.paths.includes("/bai-viet/bai-moi"));
  assert.ok(expansion.paths.includes("/chuyen-muc/tin-tuc"));
  assert.ok(expansion.dynamicPatterns.includes("/bai-viet/[slug]"));
  assert.ok(expansion.dynamicPatterns.includes("/chuyen-muc/[...slug]"));
});

test("home invalidation avoids layout while settings invalidates layout", async () => {
  const home = parseRevalidationContract({
    event: "manual.home.revalidate",
    module: "home",
    tags: ["home"],
    paths: ["/"],
    scopes: ["home"],
    meta: {},
  });
  const settings = parseRevalidationContract({
    event: "settings.updated",
    module: "settings",
    tags: ["settings"],
    paths: [],
    scopes: ["settings"],
    meta: {},
  });

  assert.equal(
    (
      await expandRevalidationRoutes(home, {
        collectPaths: emptyPathCollection,
      })
    ).layoutRevalidate,
    false,
  );
  assert.equal(
    (
      await expandRevalidationRoutes(settings, {
        collectPaths: emptyPathCollection,
      })
    ).layoutRevalidate,
    true,
  );
});

test("catalog invalidation refreshes the root layout category menu", async () => {
  const expansion = await expandRevalidationRoutes(
    contract({
      entityType: "catalog-category",
      operation: "update",
      newSlug: "cua-cong",
    }),
    { collectPaths: emptyPathCollection },
  );

  assert.equal(expansion.layoutRevalidate, true);
});

test("engine invalidates tags before reading fresh routes", async () => {
  const actions: string[] = [];
  const result = await runRevalidationEngine(
    contract({
      entityType: "catalog-item",
      operation: "create",
      newSlug: "moi",
    }),
    {
      invalidateTag(tag) {
        actions.push(`tag:${tag}`);
      },
      async expandRoutes() {
        actions.push("expand");
        return {
          paths: ["/san-pham/moi"],
          dynamicPatterns: ["/san-pham/[slug]"],
          tags: [],
          layoutRevalidate: false,
          reason: "catalog-event",
          sources: {
            static: [],
            requested: [],
            catalog: [],
            posts: [],
            pages: [],
            faq: [],
            legacyMapped: [],
            entityHints: [],
          },
          legacySignals: {
            receivedPaths: [],
            receivedLegacyPaths: [],
            detectedCatalogLegacy: false,
            detectedBlogLegacy: false,
          },
          requiredStaticPaths: [],
          missingRequiredStaticPaths: [],
          errors: [],
        };
      },
      invalidatePath(pathname, type) {
        actions.push(`path:${pathname}:${type ?? "concrete"}`);
      },
    },
  );

  assert.ok(actions.indexOf("tag:catalog") < actions.indexOf("expand"));
  assert.deepEqual(result.revalidatedPatterns, ["/san-pham/[slug]"]);
  assert.ok(actions.includes("path:/san-pham/[slug]:page"));
});

function v2Payload(eventId = "evt-health") {
  return {
    eventId,
    websiteId: "site-1",
    event: "health.check",
    module: "health",
    paths: [],
    tags: [],
    scopes: [],
    source: "dashboard-admin" as const,
    timestamp: String(Date.now()),
    meta: { contractVersion: "frontend-revalidation-v2" as const },
  };
}

async function withEnv(
  values: Record<string, string | undefined>,
  callback: () => Promise<void>,
) {
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });

  try {
    await callback();
  } finally {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
}

function signedRequest(
  payload: unknown,
  overrides: Record<string, string> = {},
) {
  const rawBody = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const signature = createV2Signature(timestamp, rawBody, "v2-secret");
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-public-site-key": "site-key",
      "x-revalidate-timestamp": timestamp,
      "x-revalidate-signature": signature,
      ...overrides,
    },
    body: rawBody,
  });
}

test("v2 returns strict ACK with the exact request eventId", async () => {
  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      REVALIDATION_SECRET: "v2-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "v2",
    },
    async () => {
      const response = await handleFrontendRevalidationRequest(
        signedRequest(v2Payload("evt-exact")),
      );
      const ack = (await response.json()) as Record<string, unknown>;
      assert.equal(response.status, 200);
      assert.equal(ack.eventId, "evt-exact");
      assert.equal(ack.status, "accepted");
      assert.equal(ack.ackVersion, "frontend-revalidation-ack-v1");
      assert.equal(typeof ack.receiverVersion, "string");
      assert.equal(ack.regenerationVerified, false);
      assert.deepEqual(ack.errors, []);
    },
  );
});

test("v2 accepts the Dashboard FRONTEND_REVALIDATE_SECRET compatibility name", async () => {
  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      REVALIDATION_SECRET: undefined,
      FRONTEND_REVALIDATE_SECRET: "v2-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "v2",
    },
    async () => {
      const response = await handleFrontendRevalidationRequest(
        signedRequest(v2Payload("evt-dashboard-secret")),
      );
      const ack = (await response.json()) as Record<string, unknown>;

      assert.equal(response.status, 200);
      assert.equal(ack.status, "accepted");
      assert.equal(ack.eventId, "evt-dashboard-secret");
    },
  );
});

test("v2 receiver rejects an expired header timestamp", async () => {
  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      REVALIDATION_SECRET: "v2-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "v2",
    },
    async () => {
      const payload = v2Payload();
      const rawBody = JSON.stringify(payload);
      const timestamp = String(Date.now() - 5 * 60 * 1000 - 1);
      const response = await handleFrontendRevalidationRequest(
        new Request("http://localhost/api/revalidate", {
          method: "POST",
          headers: {
            "x-public-site-key": "site-key",
            "x-revalidate-timestamp": timestamp,
            "x-revalidate-signature": createV2Signature(
              timestamp,
              rawBody,
              "v2-secret",
            ),
          },
          body: rawBody,
        }),
      );

      assert.equal(response.status, 401);
      assert.equal(
        ((await response.json()) as { errorCode?: string }).errorCode,
        "expired_revalidation_request",
      );
    },
  );
});

test("wrong site key and signature fail without exposing secrets", async () => {
  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      REVALIDATION_SECRET: "v2-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "v2",
    },
    async () => {
      const badKey = await handleFrontendRevalidationRequest(
        signedRequest(v2Payload(), { "x-public-site-key": "wrong" }),
      );
      assert.equal(badKey.status, 401);

      const badSignature = await handleFrontendRevalidationRequest(
        signedRequest(v2Payload(), { "x-revalidate-signature": "00" }),
      );
      const body = await badSignature.text();
      assert.equal(badSignature.status, 401);
      assert.equal(body.includes("v2-secret"), false);
      assert.equal(body.includes("site-key"), false);
    },
  );
});

test("protocol selection never upgrades metadata-only legacy payload", () => {
  const metadataOnly = {
    meta: { contractVersion: "frontend-revalidation-v2" },
  };
  assert.equal(selectRequestProtocol("dual", metadataOnly), "legacy");
  assert.equal(selectRequestProtocol("v2", metadataOnly), "v2");
});

test("legacy is disabled in v2 mode and enabled only by explicit legacy mode", async () => {
  const legacyPayload = {
    event: "health.check",
    tags: [],
    paths: [],
    meta: {},
  };
  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      REVALIDATION_SECRET: "v2-secret",
      FRONTEND_REVALIDATE_SECRET: "legacy-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "v2",
    },
    async () => {
      const response = await handleFrontendRevalidationRequest(
        signedRequest(legacyPayload),
      );
      assert.equal(response.status, 400);
    },
  );

  await withEnv(
    {
      PUBLIC_SITE_KEY: "site-key",
      FRONTEND_REVALIDATE_SECRET: "legacy-secret",
      FRONTEND_REVALIDATION_PROTOCOL: "legacy",
    },
    async () => {
      const response = await handleFrontendRevalidationRequest(
        new Request("http://localhost/api/revalidate", {
          method: "POST",
          headers: {
            "x-public-site-key": "site-key",
            "x-revalidate-secret": "legacy-secret",
          },
          body: JSON.stringify(legacyPayload),
        }),
      );
      const ack = (await response.json()) as {
        data?: { acknowledgementStrength?: string };
      };
      assert.equal(response.status, 200);
      assert.equal(ack.data?.acknowledgementStrength, "weak");
    },
  );
});

test("route registry covers every public dynamic page and both API routes delegate", async () => {
  assert.deepEqual(CATALOG_DYNAMIC_PAGE_PATTERNS, [
    "/danh-muc/[...slug]",
    "/san-pham/[slug]",
  ]);
  assert.deepEqual(POSTS_DYNAMIC_PAGE_PATTERNS, [
    "/chuyen-muc/[...slug]",
    "/bai-viet/[slug]",
    "/du-an/[slug]",
  ]);
  assert.deepEqual(PAGES_DYNAMIC_PAGE_PATTERNS, ["/[slug]", "/chinh-sach/[slug]"]);

  for (const route of [
    "app/api/revalidate/route.ts",
    "app/api/webhooks/revalidate/route.ts",
  ]) {
    const source = await readFile(path.join(process.cwd(), route), "utf8");
    assert.match(source, /handleFrontendRevalidationRequest\(request\)/);
    assert.doesNotMatch(source, /createHmac|revalidateTag|revalidatePath/);
  }
});
