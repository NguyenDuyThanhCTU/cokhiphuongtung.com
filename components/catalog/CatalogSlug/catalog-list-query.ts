import type {
  CatalogListQuery,
  CatalogListSearchParams,
  CatalogSortOption,
} from "@/features/catalog/types";

export type SearchParamsValue = string | string[] | undefined;
export type SearchParamsRecord = Record<string, SearchParamsValue>;

const SORT_OPTIONS = new Set<CatalogSortOption>([
  "newest",
  "price_asc",
  "price_desc",
  "sort_order",
]);

const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

export function getFirstValue(value: SearchParamsValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeString(value: SearchParamsValue) {
  const firstValue = getFirstValue(value);
  const trimmed = typeof firstValue === "string" ? firstValue.trim() : "";

  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizePositiveInteger(
  value: SearchParamsValue,
  fallback: number,
  options?: { max?: number },
) {
  const firstValue = getFirstValue(value);
  const parsed = Number.parseInt(firstValue ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, options?.max ?? parsed);
}

function normalizeBoolean(value: SearchParamsValue) {
  const firstValue = getFirstValue(value);

  if (typeof firstValue !== "string") {
    return undefined;
  }

  return TRUE_VALUES.has(firstValue.trim().toLowerCase()) ? true : undefined;
}

function normalizeSort(value: SearchParamsValue) {
  const firstValue = getFirstValue(value);

  if (SORT_OPTIONS.has(firstValue as CatalogSortOption)) {
    return firstValue as CatalogSortOption;
  }

  return undefined;
}

/**
 * Parse searchParams for catalog listing pages.
 *
 * Important: category is intentionally not parsed here.
 * - /danh-muc uses no category filter.
 * - /danh-muc/[...slug] injects category from the route param.
 */
export function parseCatalogListSearchParams(
  searchParams: SearchParamsRecord = {},
): CatalogListQuery {
  const query: CatalogListQuery = {
    page: normalizePositiveInteger(searchParams.page, 1),
    limit: normalizePositiveInteger(searchParams.limit, DEFAULT_LIMIT, {
      max: MAX_LIMIT,
    }),
  };

  const q = normalizeString(searchParams.q);
  const tag = normalizeString(searchParams.tag);
  const featured = normalizeBoolean(searchParams.featured);
  const bestSeller = normalizeBoolean(searchParams.bestSeller);
  const discounted = normalizeBoolean(searchParams.discounted);
  const sort = normalizeSort(searchParams.sort);

  if (q) query.q = q;
  if (tag) query.tag = tag;
  if (featured !== undefined) query.featured = featured;
  if (bestSeller !== undefined) query.bestSeller = bestSeller;
  if (discounted !== undefined) query.discounted = discounted;
  if (sort) query.sort = sort;

  return query;
}

export function getCatalogListSearchParamsSnapshot(
  searchParams: SearchParamsRecord = {},
): CatalogListSearchParams {
  return {
    page: getFirstValue(searchParams.page),
    limit: getFirstValue(searchParams.limit) ?? String(DEFAULT_LIMIT),
    q: getFirstValue(searchParams.q),
    tag: getFirstValue(searchParams.tag),
    featured: getFirstValue(searchParams.featured),
    bestSeller: getFirstValue(searchParams.bestSeller),
    discounted: getFirstValue(searchParams.discounted),
    sort: getFirstValue(searchParams.sort) as CatalogSortOption | undefined,
  };
}

export function buildCatalogListHref(
  basePath: string,
  searchParams: SearchParamsRecord,
  updates: Record<string, string | number | boolean | null | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === "category") return;

    const firstValue = getFirstValue(value);

    if (firstValue) {
      params.set(key, firstValue);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (key === "category") return;

    if (value === null || value === undefined || value === "" || value === false) {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  if (params.get("page") === "1") {
    params.delete("page");
  }

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function hasActiveCatalogFilters(searchParams: SearchParamsRecord = {}) {
  const snapshot = getCatalogListSearchParamsSnapshot(searchParams);

  return Boolean(
    snapshot.q ||
      snapshot.tag ||
      snapshot.featured ||
      snapshot.bestSeller ||
      snapshot.discounted ||
      snapshot.sort,
  );
}
