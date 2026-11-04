import assert from "node:assert/strict";
import test from "node:test";

import type { CatalogItem } from "@/features/catalog/types";
import { sortHomeCatalogItems } from "@/features/catalog/utils/sort-home-catalog-items";

function product(
  id: string,
  createdAt: string | undefined,
  isFeatured = false,
): CatalogItem {
  return {
    id,
    title: id,
    slug: id,
    createdAt,
    isFeatured,
  };
}

test("sortHomeCatalogItems prioritizes featured products, then creation date", () => {
  const products = [
    product("regular-new", "2026-11-04T00:00:00.000Z"),
    product("featured-old", "2026-01-01T00:00:00.000Z", true),
    product("regular-old", "2025-01-01T00:00:00.000Z"),
    product("featured-new", "2026-10-01T00:00:00.000Z", true),
  ];

  assert.deepEqual(
    sortHomeCatalogItems(products).map((item) => item.id),
    ["featured-new", "featured-old", "regular-new", "regular-old"],
  );
});

test("sortHomeCatalogItems does not mutate the API response", () => {
  const products = [
    product("old", "2025-01-01T00:00:00.000Z"),
    product("new", "2026-01-01T00:00:00.000Z"),
  ];

  sortHomeCatalogItems(products);

  assert.deepEqual(products.map((item) => item.id), ["old", "new"]);
});
