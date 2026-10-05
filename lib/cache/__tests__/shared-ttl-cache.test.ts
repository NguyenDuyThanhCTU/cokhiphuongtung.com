import assert from "node:assert/strict";
import test from "node:test";
import { SharedTtlCache } from "../shared-ttl-cache";

test("concurrent visitors share one load, including the first refresh after expiry", async () => {
  let now = 0;
  let loads = 0;
  let value = "old title";
  const cache = new SharedTtlCache<string>(5_000, () => now);
  const load = async () => { loads += 1; return value; };
  assert.deepEqual(await Promise.all(Array.from({ length: 20 }, () => cache.get(load))),
    Array(20).fill("old title"));
  assert.equal(loads, 1);

  value = "new title";
  now = 4_999;
  assert.equal(await cache.get(load), "old title");
  now = 5_000;
  assert.deepEqual(await Promise.all(Array.from({ length: 20 }, () => cache.get(load))),
    Array(20).fill("new title"));
  assert.equal(loads, 2);
});

test("a webhook invalidates a fresh snapshot before its TTL expires", async () => {
  const cache = new SharedTtlCache<string>(5_000);
  assert.equal(await cache.get(async () => "old title"), "old title");
  cache.invalidate();
  assert.equal(await cache.get(async () => "new title"), "new title");
});

test("a load started before invalidation cannot repopulate the current cache", async () => {
  const cache = new SharedTtlCache<string>(5_000);
  let finishOld!: (value: string) => void;
  const old = cache.get(() => new Promise<string>((resolve) => { finishOld = resolve; }));
  await Promise.resolve();
  cache.invalidate();
  assert.equal(await cache.get(async () => "new title"), "new title");
  finishOld("old title");
  await old;
  assert.equal(await cache.get(async () => "unexpected reload"), "new title");
});

test("failed refreshes are retried instead of cached as empty data", async () => {
  const cache = new SharedTtlCache<string>(5_000);
  await assert.rejects(cache.get(async () => { throw new Error("API unavailable"); }));
  assert.equal(await cache.get(async () => "recovered title"), "recovered title");
});
