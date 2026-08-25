import type {
  CatalogListQuery,
  CatalogListSearchParams,
  CatalogSortOption,
} from "@/features/catalog/types";

export type CatalogSearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const SORT_OPTIONS = new Set<CatalogSortOption>([
  "newest",
  "price_asc",
  "price_desc",
  "sort_order",
]);

const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);
const FALSE_VALUES = new Set(["false", "0", "no", "off"]);

export function getFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function cleanText(value: string | string[] | undefined) {
  const firstValue = getFirstValue(value)?.trim();
  return firstValue ? firstValue : undefined;
}

function parsePositiveInteger(
  value: string | string[] | undefined,
  fallback: number,
  options?: { max?: number },
) {
  const rawValue = getFirstValue(value);
  const parsedValue = Number.parseInt(rawValue ?? "", 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return options?.max ? Math.min(parsedValue, options.max) : parsedValue;
}

function parseBooleanFlag(value: string | string[] | undefined) {
  const rawValue = getFirstValue(value)?.trim().toLowerCase();

  if (!rawValue) return undefined;
  if (TRUE_VALUES.has(rawValue)) return true;
  if (FALSE_VALUES.has(rawValue)) return false;

  return undefined;
}

function parseSortOption(value: string | string[] | undefined) {
  const rawValue = getFirstValue(value)?.trim() as
    | CatalogSortOption
    | undefined;

  if (!rawValue || !SORT_OPTIONS.has(rawValue)) {
    return undefined;
  }

  return rawValue;
}

export function parseCatalogListSearchParams(
  searchParams: CatalogListSearchParams | CatalogSearchParamsInput = {},
): CatalogListQuery {
  const query: CatalogListQuery = {
    page: parsePositiveInteger(searchParams.page, DEFAULT_PAGE),
    limit: parsePositiveInteger(searchParams.limit, DEFAULT_LIMIT, {
      max: MAX_LIMIT,
    }),
  };

  const q = cleanText(searchParams.q);
  const tag = cleanText(searchParams.tag);
  const featured = parseBooleanFlag(searchParams.featured);
  const bestSeller = parseBooleanFlag(searchParams.bestSeller);
  const discounted = parseBooleanFlag(searchParams.discounted);
  const sort = parseSortOption(searchParams.sort);

  if (q) query.q = q;
  if (tag) query.tag = tag;
  if (typeof featured === "boolean") query.featured = featured;
  if (typeof bestSeller === "boolean") query.bestSeller = bestSeller;
  if (typeof discounted === "boolean") query.discounted = discounted;
  if (sort) query.sort = sort;

  // Không xử lý category tại trang /danh-muc ở bước này.
  // category sẽ được xử lý riêng ở route slug sau.
  return query;
}

function appendParam(
  params: URLSearchParams,
  key: string,
  value: string | string[] | number | boolean | null | undefined,
) {
  if (value === null || typeof value === "undefined" || value === "") {
    params.delete(key);
    return;
  }

  params.delete(key);

  if (Array.isArray(value)) {
    value.filter(Boolean).forEach((item) => params.append(key, item));
    return;
  }

  params.set(key, String(value));
}

export function createCatalogSearchParams(
  currentParams: CatalogSearchParamsInput = {},
  patch: Partial<
    CatalogListSearchParams &
      Record<string, string | number | boolean | null | undefined>
  > = {},
) {
  const params = new URLSearchParams();

  Object.entries(currentParams).forEach(([key, value]) => {
    // Không giữ category ở trang /danh-muc.
    if (key === "category") return;

    const firstValue = getFirstValue(value);
    if (firstValue) params.set(key, firstValue);
  });

  Object.entries(patch).forEach(([key, value]) => {
    appendParam(params, key, value);
  });

  // URL gọn hơn: trang 1 và limit mặc định không cần xuất hiện.
  if (params.get("page") === String(DEFAULT_PAGE)) {
    params.delete("page");
  }

  if (params.get("limit") === String(DEFAULT_LIMIT)) {
    params.delete("limit");
  }

  params.delete("category");

  return params;
}

export function buildCatalogHref(
  currentParams: CatalogSearchParamsInput = {},
  patch: Partial<
    CatalogListSearchParams &
      Record<string, string | number | boolean | null | undefined>
  > = {},
  pathname = "/danh-muc",
) {
  const params = createCatalogSearchParams(currentParams, patch);
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function isParamEnabled(value: string | string[] | undefined) {
  return parseBooleanFlag(value) === true;
}
