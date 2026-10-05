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
  } catch {
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
