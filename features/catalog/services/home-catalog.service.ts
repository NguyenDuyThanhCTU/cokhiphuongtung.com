import { getPublicEnv } from "@/lib/config/env";
import { SharedTtlCache } from "@/lib/cache/shared-ttl-cache";
import type { CatalogCategory, CatalogItem } from "@/features/catalog/types";
import { getCatalogCategories, getCatalogItems } from "./catalog.service";

export const HOME_CATALOG_TTL_MS = 5_000;
const PAGE_SIZE = 50;

type HomeCatalogSnapshot = {
  categories: CatalogCategory[];
  products: CatalogItem[];
};

// Route handlers and pages are separate bundles. Store the cache on globalThis
// so a webhook clears the same cache used by the page in this Node process.
const sharedState = globalThis as typeof globalThis & {
  __homeCatalogCaches?: Map<string, SharedTtlCache<HomeCatalogSnapshot>>;
};

function getCaches() {
  return sharedState.__homeCatalogCaches ??= new Map();
}

export function invalidateHomeCatalog(): void {
  getCaches().forEach((cache) => cache.invalidate());
}

async function loadHomeCatalog(): Promise<HomeCatalogSnapshot> {
  const options = { cache: "no-store" as const, throwOnError: true };
  const [categories, firstPage] = await Promise.all([
    getCatalogCategories(options),
    getCatalogItems({ page: 1, limit: PAGE_SIZE, sort: "sort_order" }, options),
  ]);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max((firstPage.meta?.totalPages ?? 1) - 1, 0) },
      (_, index) => getCatalogItems({
        page: index + 2, limit: PAGE_SIZE, sort: "sort_order",
      }, options)),
  );
  const products = new Map<string, CatalogItem>();
  for (const page of [firstPage, ...remainingPages]) {
    for (const item of page.items) products.set(item.id || item.slug, item);
  }
  return { categories, products: Array.from(products.values()) };
}

export function getHomeCatalog(): Promise<HomeCatalogSnapshot> {
  const env = getPublicEnv();
  const key = JSON.stringify([env.NEXT_PUBLIC_API_BASE_URL, env.NEXT_PUBLIC_SITE_KEY]);
  const caches = getCaches();
  let cache = caches.get(key);
  if (!cache) {
    cache = new SharedTtlCache<HomeCatalogSnapshot>(HOME_CATALOG_TTL_MS);
    caches.set(key, cache);
  }
  return cache.get(loadHomeCatalog);
}
