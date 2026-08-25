export const PUBLIC_STATIC_ROUTES = [
  "/",
  "/danh-muc",
  "/chuyen-muc",
  "/lien-he",
] as const;

export const PUBLIC_REQUIRED_ROOT_ROUTES = [
  "/",
  "/danh-muc",
  "/chuyen-muc",
] as const;

export const CATALOG_ROOT_ROUTES = ["/danh-muc"] as const;

export const POSTS_ROOT_ROUTES = ["/chuyen-muc"] as const;

export const PUBLIC_POST_DETAIL_ROUTE_PREFIX = "/bai-viet" as const;

export const CATALOG_DYNAMIC_PAGE_PATTERNS = [
  "/danh-muc/[...slug]",
  "/dich-vu/[slug]",
] as const;

export const POSTS_DYNAMIC_PAGE_PATTERNS = [
  "/chuyen-muc/[...slug]",
  "/bai-viet/[slug]",
] as const;

export const PAGES_DYNAMIC_PAGE_PATTERNS = ["/[slug]"] as const;
