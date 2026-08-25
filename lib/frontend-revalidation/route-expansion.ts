import { collectPublicRevalidationPaths } from "@/lib/cache/public-revalidation-paths";
import {
  getAllSignalPaths,
  getCategorySlugs,
  getEntitySlugs,
  isCatalogEvent,
  isFaqEvent,
  isFullSiteEvent,
  isGlobalEvent,
  isHomeEvent,
  isPagesEvent,
  isPostCategoriesEvent,
  isPostsEvent,
  isPostTagsEvent,
  type NormalizedRevalidationContract,
} from "@/lib/frontend-revalidation/contract";
import {
  CATALOG_DYNAMIC_PAGE_PATTERNS,
  CATALOG_ROOT_ROUTES,
  PAGES_DYNAMIC_PAGE_PATTERNS,
  POSTS_DYNAMIC_PAGE_PATTERNS,
  POSTS_ROOT_ROUTES,
  PUBLIC_POST_DETAIL_ROUTE_PREFIX,
  PUBLIC_REQUIRED_ROOT_ROUTES,
  PUBLIC_STATIC_ROUTES,
} from "@/lib/frontend-revalidation/route-registry";

export const DEFAULT_MAX_REVALIDATION_PATHS = 300;

export type RouteExpansionDependencies = {
  collectPaths: typeof collectPublicRevalidationPaths;
};

const defaultDependencies: RouteExpansionDependencies = {
  collectPaths: collectPublicRevalidationPaths,
};

type ExpansionSources = {
  static: string[];
  requested: string[];
  catalog: string[];
  posts: string[];
  pages: string[];
  faq: string[];
  legacyMapped: string[];
  entityHints: string[];
};

export type RevalidationPathExpansion = {
  paths: string[];
  dynamicPatterns: string[];
  tags: string[];
  layoutRevalidate: boolean;
  reason: string;
  sources: ExpansionSources;
  legacySignals: {
    receivedPaths: string[];
    receivedLegacyPaths: string[];
    detectedCatalogLegacy: boolean;
    detectedBlogLegacy: boolean;
  };
  requiredStaticPaths: string[];
  missingRequiredStaticPaths: string[];
  errors: string[];
};

function emptySources(): ExpansionSources {
  return {
    static: [],
    requested: [],
    catalog: [],
    posts: [],
    pages: [],
    faq: [],
    legacyMapped: [],
    entityHints: [],
  };
}

export function normalizePublicRevalidationPath(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("?") || trimmed.includes("#")) return null;

  let pathname = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");

  const lowerPath = pathname.toLowerCase();
  if (
    lowerPath.startsWith("/api") ||
    lowerPath.startsWith("/debug") ||
    lowerPath.startsWith("/admin") ||
    lowerPath.startsWith("/dashboard") ||
    lowerPath.startsWith("/god") ||
    lowerPath.startsWith("/user")
  ) {
    return null;
  }

  return pathname;
}

function pushPath(paths: string[], value: string | null) {
  if (value) paths.push(value);
}

function uniquePaths(values: string[]): string[] {
  return Array.from(
    new Set(
      values.map(normalizePublicRevalidationPath).filter(Boolean) as string[],
    ),
  );
}

function hasLegacyPrefix(path: string, prefixes: string[]): boolean {
  const normalized = path.toLowerCase();
  return prefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

function pathSegments(path: string): string[] {
  return path
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function mapLegacyPaths(paths: string[]) {
  const mapped: string[] = [];
  const detectedCatalogLegacy = paths.some((path) =>
    hasLegacyPrefix(path, ["/products", "/san-pham"]),
  );
  const detectedBlogLegacy = paths.some((path) =>
    hasLegacyPrefix(path, ["/blog", "/bai-viet"]),
  );

  for (const path of paths) {
    const lowerPath = path.toLowerCase();
    const segments = pathSegments(lowerPath);

    if (hasLegacyPrefix(lowerPath, ["/products", "/san-pham"])) {
      for (const root of CATALOG_ROOT_ROUTES) pushPath(mapped, root);

      if (segments[1] === "category" && segments[2]) {
        pushPath(mapped, `/danh-muc/${segments[2]}`);
      } else if (segments[1]) {
        pushPath(mapped, `/dich-vu/${segments[1]}`);
      }
    }

    if (hasLegacyPrefix(lowerPath, ["/blog", "/bai-viet"])) {
      for (const root of POSTS_ROOT_ROUTES) pushPath(mapped, root);

      if (segments[1] === "category" && segments[2]) {
        pushPath(mapped, `/chuyen-muc/${segments[2]}`);
      } else if (segments[0] === "blog" && segments[1]) {
        pushPath(mapped, `/chuyen-muc/${segments[1]}`);
      } else if (segments[0] === "bai-viet" && segments[1]) {
        pushPath(mapped, `${PUBLIC_POST_DETAIL_ROUTE_PREFIX}/${segments[1]}`);
      }
    }
  }

  return {
    paths: uniquePaths(mapped),
    detectedCatalogLegacy,
    detectedBlogLegacy,
  };
}

function collectEntityHintPaths(
  contract: NormalizedRevalidationContract,
  catalogEvent: boolean,
  postEvent: boolean,
  pageEvent: boolean,
): string[] {
  const paths: string[] = [];
  const slugs = getEntitySlugs(contract);
  const categorySlugs = getCategorySlugs(contract);
  const categoryAndEntitySlugs = Array.from(
    new Set([...categorySlugs, ...slugs]),
  );

  if (catalogEvent) {
    for (const root of CATALOG_ROOT_ROUTES) pushPath(paths, root);

    for (const slug of categoryAndEntitySlugs) {
      pushPath(paths, `/danh-muc/${slug}`);
    }
    for (const slug of slugs) {
      pushPath(paths, `/dich-vu/${slug}`);
    }
  }

  if (postEvent) {
    for (const root of POSTS_ROOT_ROUTES) pushPath(paths, root);

    for (const slug of categoryAndEntitySlugs) {
      pushPath(paths, `/chuyen-muc/${slug}`);
    }
    if (contract.meta.entityType === "post") {
      for (const slug of slugs) {
        pushPath(paths, `${PUBLIC_POST_DETAIL_ROUTE_PREFIX}/${slug}`);
      }
    }
  }

  if (pageEvent) {
    pushPath(paths, "/");
    for (const slug of slugs) {
      pushPath(paths, `/${slug}`);
    }
  }

  return uniquePaths(paths);
}

function limitPaths(paths: string[], errors: string[]): string[] {
  const unique = uniquePaths(paths);
  if (unique.length <= DEFAULT_MAX_REVALIDATION_PATHS) return unique;

  errors.push(
    `Path expansion reached limit ${DEFAULT_MAX_REVALIDATION_PATHS}; remaining paths were skipped.`,
  );
  return unique.slice(0, DEFAULT_MAX_REVALIDATION_PATHS);
}

export async function expandRevalidationRoutes(
  contract: NormalizedRevalidationContract,
  dependencies: RouteExpansionDependencies = defaultDependencies,
): Promise<RevalidationPathExpansion> {
  const sources = emptySources();
  const errors: string[] = [];
  const paths: string[] = [];
  const dynamicPatterns: string[] = [];
  const fullSiteEvent = isFullSiteEvent(contract);
  const globalEvent = isGlobalEvent(contract);
  const homeEvent = isHomeEvent(contract);
  const catalogEvent = isCatalogEvent(contract);
  const postsEvent =
    isPostsEvent(contract) ||
    isPostCategoriesEvent(contract) ||
    isPostTagsEvent(contract);
  const pageEvent = isPagesEvent(contract);
  const faqEvent = isFaqEvent(contract);
  const legacySignals = {
    receivedPaths: contract.paths,
    receivedLegacyPaths: contract.meta.legacyPaths,
    ...mapLegacyPaths(getAllSignalPaths(contract)),
  };
  const legacyMapped = legacySignals.paths;
  sources.legacyMapped = legacyMapped;
  sources.requested = uniquePaths(contract.paths).filter(
    (path) =>
      !hasLegacyPrefix(path, ["/products", "/san-pham", "/blog", "/bai-viet"]),
  );

  const shouldExpandFullSite = fullSiteEvent;
  const shouldExpandGlobal = globalEvent;

  if (shouldExpandFullSite) {
    dynamicPatterns.push(
      ...CATALOG_DYNAMIC_PAGE_PATTERNS,
      ...POSTS_DYNAMIC_PAGE_PATTERNS,
      ...PAGES_DYNAMIC_PAGE_PATTERNS,
    );
  }

  if (shouldExpandFullSite || shouldExpandGlobal) {
    const expansion = await dependencies.collectPaths({
      includeStatic: true,
      includeCatalog: shouldExpandFullSite,
      includePosts: shouldExpandFullSite,
      includePages: shouldExpandFullSite,
      includeSitemap: shouldExpandFullSite,
      limit: DEFAULT_MAX_REVALIDATION_PATHS,
    });

    sources.static = expansion.sources.static ?? [];
    sources.catalog = expansion.sources.catalog ?? [];
    sources.posts = expansion.sources.posts ?? [];
    sources.pages = expansion.sources.pages ?? [];
    errors.push(...expansion.errors);
    paths.push(...expansion.paths);

    if (shouldExpandGlobal) {
      for (const route of PUBLIC_STATIC_ROUTES) pushPath(paths, route);
    }
  }

  if (homeEvent) {
    pushPath(paths, "/");
    sources.static.push("/");
  }

  if (
    !shouldExpandFullSite &&
    (catalogEvent || legacySignals.detectedCatalogLegacy)
  ) {
    dynamicPatterns.push(...CATALOG_DYNAMIC_PAGE_PATTERNS);
    pushPath(paths, "/");
    for (const root of CATALOG_ROOT_ROUTES) pushPath(paths, root);

    const expansion = await dependencies.collectPaths({
      includeStatic: false,
      includeCatalog: true,
      includePosts: false,
      includePages: false,
      includeSitemap: false,
      limit: DEFAULT_MAX_REVALIDATION_PATHS,
    });

    sources.catalog.push(...(expansion.sources.catalog ?? expansion.paths));
    errors.push(...expansion.errors);
    paths.push(...expansion.paths);
  }

  if (
    !shouldExpandFullSite &&
    (postsEvent || legacySignals.detectedBlogLegacy)
  ) {
    dynamicPatterns.push(...POSTS_DYNAMIC_PAGE_PATTERNS);
    pushPath(paths, "/");
    for (const root of POSTS_ROOT_ROUTES) pushPath(paths, root);

    const expansion = await dependencies.collectPaths({
      includeStatic: false,
      includeCatalog: false,
      includePosts: true,
      includePages: false,
      includeSitemap: false,
      limit: DEFAULT_MAX_REVALIDATION_PATHS,
    });

    sources.posts.push(...(expansion.sources.posts ?? expansion.paths));
    errors.push(...expansion.errors);
    paths.push(...expansion.paths);
  }

  if (pageEvent && !shouldExpandFullSite) {
    dynamicPatterns.push(...PAGES_DYNAMIC_PAGE_PATTERNS);
    pushPath(paths, "/");

    const expansion = await dependencies.collectPaths({
      includeStatic: false,
      includeCatalog: false,
      includePosts: false,
      includePages: true,
      includeSitemap: true,
      limit: DEFAULT_MAX_REVALIDATION_PATHS,
    });

    sources.pages.push(...(expansion.sources.pages ?? expansion.paths));
    errors.push(...expansion.errors);
    paths.push(...expansion.paths);
  }

  if (faqEvent) {
    pushPath(paths, "/");
    sources.faq.push("/");
  }

  const entityHints = collectEntityHintPaths(
    contract,
    catalogEvent || legacySignals.detectedCatalogLegacy,
    postsEvent || legacySignals.detectedBlogLegacy,
    pageEvent,
  );
  sources.entityHints = entityHints;
  paths.push(...sources.requested, ...legacyMapped, ...entityHints);

  const requiredStaticPaths =
    shouldExpandFullSite || shouldExpandGlobal
      ? Array.from(PUBLIC_REQUIRED_ROOT_ROUTES)
      : [];
  const finalPaths = limitPaths(paths, errors);
  const finalPathSet = new Set(finalPaths);

  return {
    paths: finalPaths,
    dynamicPatterns: uniquePaths(dynamicPatterns),
    tags: contract.tags,
    layoutRevalidate: shouldExpandFullSite || globalEvent,
    reason: shouldExpandFullSite
      ? "full-site-event"
      : shouldExpandGlobal
        ? "global-event"
        : homeEvent
          ? "home-event"
          : catalogEvent || legacySignals.detectedCatalogLegacy
            ? "catalog-event"
            : postsEvent || legacySignals.detectedBlogLegacy
              ? "posts-event"
              : pageEvent
                ? "pages-event"
                : faqEvent
                  ? "faq-event"
                  : "requested-paths",
    sources,
    legacySignals: {
      receivedPaths: legacySignals.receivedPaths,
      receivedLegacyPaths: legacySignals.receivedLegacyPaths,
      detectedCatalogLegacy: legacySignals.detectedCatalogLegacy,
      detectedBlogLegacy: legacySignals.detectedBlogLegacy,
    },
    requiredStaticPaths,
    missingRequiredStaticPaths: requiredStaticPaths.filter(
      (path) => !finalPathSet.has(path),
    ),
    errors,
  };
}
