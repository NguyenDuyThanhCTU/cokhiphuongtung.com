import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/api/public-api";
import { cacheTags } from "@/lib/cache/cache-tags";
import type {
  CatalogCategory,
  CatalogItem,
  CatalogListQuery,
  CatalogListResult,
  CatalogTag,
  CatalogVariant,
} from "@/features/catalog/types";
import {
  catalogCategoryListSchema,
  catalogItemSchema,
  catalogListQuerySchema,
  catalogTagListSchema,
  catalogVariantListSchema,
} from "@/features/catalog/schemas/catalog.schema";
import { buildCatalogQuery } from "@/features/catalog/utils/build-catalog-query";
import { searchCatalogItems } from "@/features/catalog/utils/catalog-search";
import { sortCatalogItemsFeaturedFirst } from "@/features/catalog/utils/sort-home-catalog-items";
import {
  normalizeCatalogCategory,
  normalizeCatalogItem,
  normalizeCatalogListResponse,
  normalizeCatalogTag,
  normalizeCatalogVariant,
} from "@/features/catalog/utils/normalize-catalog-response";
import { asArray, unwrapApiData } from "@/lib/utils/api-normalizers";

function parseQuery(query?: CatalogListQuery): CatalogListQuery {
  return catalogListQuerySchema.parse(query ?? {});
}

type CatalogFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  throwOnError?: boolean;
};

export async function getCatalogItems(
  query?: CatalogListQuery,
  options: CatalogFetchOptions = {},
): Promise<CatalogListResult> {
  try {
    const safeQuery = parseQuery(query);

    const payload = await publicApiFetch<unknown>(
      `/api/public/catalog${buildCatalogQuery(safeQuery)}`,
      {
        next: {
          tags: [cacheTags.catalog],
          revalidate: options.revalidate,
        },
        cache: options.cache,
      },
    );

    return normalizeCatalogListResponse(payload);
  } catch (error) {
    if (options.throwOnError) throw error;
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to load catalog items", error);
    }

    return {
      items: [],
      meta: {
        page: query?.page ?? 1,
        limit: query?.limit ?? 12,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

// Use the same tagged Next.js fetch cache as catalog pages, including every page.
export async function getAllCatalogItems(
  query: Omit<CatalogListQuery, "page" | "limit"> = {},
): Promise<CatalogItem[]> {
  const pageSize = 50;
  const firstPage = await getCatalogItems({ ...query, page: 1, limit: pageSize });
  const pages = [firstPage];

  // The public API can reset connections when all catalog pages are requested
  // concurrently. Load them in order so featured products are never omitted
  // from the complete set before client-facing sorting and pagination.
  for (let page = 2; page <= (firstPage.meta?.totalPages ?? 1); page += 1) {
    pages.push(
      await getCatalogItems({ ...query, page, limit: pageSize }),
    );
  }

  const items = new Map<string, CatalogItem>();
  for (const page of pages) {
    for (const item of page.items) items.set(item.id || item.slug, item);
  }
  return Array.from(items.values());
}

export async function getCatalogItemsWithFlexibleSearch(
  query: CatalogListQuery,
): Promise<CatalogListResult> {
  const keyword = query.q?.trim();

  // Other explicit sort modes can use the API's native pagination directly.
  if (!keyword && query.sort !== "newest") {
    return getCatalogItems(query);
  }

  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.max(query.limit ?? 20, 1);
  const { q: _q, page: _page, limit: _limit, ...filters } = query;
  const allItems = await getAllCatalogItems(filters);
  const matchingItems = keyword
    ? searchCatalogItems(allItems, keyword)
    : allItems;
  const orderedItems =
    query.sort === "newest"
      ? sortCatalogItemsFeaturedFirst(matchingItems)
      : matchingItems;
  const total = orderedItems.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * limit;

  return {
    items: orderedItems.slice(startIndex, startIndex + limit),
    meta: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getCatalogItemBySlug(slug: string): Promise<CatalogItem> {
  try {
    const payload = await publicApiFetch<unknown>(
      `/api/public/catalog/${encodeURIComponent(slug)}`,
      {
        next: { tags: [cacheTags.catalog] },
      },
    );
    const parsed = catalogItemSchema.safeParse(
      normalizeCatalogItem(unwrapApiData(payload)),
    );

    if (!parsed.success) {
      notFound();
    }

    return parsed.data;
  } catch {
    notFound();
  }
}

export async function getCatalogCategories(
  options: CatalogFetchOptions = {},
): Promise<CatalogCategory[]> {
  try {
    const payload = await publicApiFetch<unknown>(
      "/api/public/catalog/categories",
      {
        next: {
          tags: [cacheTags.catalog, cacheTags.catalogCategories],
          revalidate: options.revalidate,
        },
        cache: options.cache,
      },
    );
    const normalized = asArray(payload).map((item, index) =>
      normalizeCatalogCategory(item, index),
    );

    return catalogCategoryListSchema.parse(normalized);
  } catch (error) {
    if (options.throwOnError) throw error;
    return [];
  }
}

export async function getCatalogTags(): Promise<CatalogTag[]> {
  try {
    const payload = await publicApiFetch<unknown>("/api/public/catalog/tags", {
      next: { tags: [cacheTags.catalog, cacheTags.catalogTags] },
    });
    const normalized = asArray(payload).map((item, index) =>
      normalizeCatalogTag(item, index),
    );

    return catalogTagListSchema.parse(normalized);
  } catch {
    return [];
  }
}

export async function getFeaturedCatalogItems(
  limit: number = 4,
): Promise<CatalogItem[]> {
  const result = await getCatalogItems({
    featured: true,
    limit,
    sort: "sort_order",
  });
  return result.items;
}

export async function getBestSellerCatalogItems(
  limit: number = 4,
): Promise<CatalogItem[]> {
  const result = await getCatalogItems({
    bestSeller: true,
    limit,
    sort: "sort_order",
  });
  return result.items;
}

export async function getDiscountedCatalogItems(
  limit: number = 4,
): Promise<CatalogItem[]> {
  const result = await getCatalogItems({
    discounted: true,
    limit,
    sort: "sort_order",
  });
  return result.items;
}

export async function getCatalogVariants(
  slug: string,
): Promise<CatalogVariant[]> {
  try {
    const payload = await publicApiFetch<unknown>(
      `/api/public/catalog/${encodeURIComponent(slug)}/variants`,
      {
        next: { tags: [cacheTags.catalog] },
      },
    );
    const normalized = asArray(payload).map((item, index) =>
      normalizeCatalogVariant(item, index),
    );

    return catalogVariantListSchema.parse(normalized);
  } catch {
    return [];
  }
}
