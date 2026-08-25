import {
  getCatalogCategories,
  getCatalogItems,
} from "@/features/catalog/services/catalog.service";
import {
  getBlogPosts,
  getPostCategories,
} from "@/features/content/services/content.service";
import { publicApiFetch } from "@/lib/api/public-api";
import { cacheTags } from "@/lib/cache/cache-tags";
import {
  CATALOG_ROOT_ROUTES,
  POSTS_ROOT_ROUTES,
  PUBLIC_REQUIRED_ROOT_ROUTES,
  PUBLIC_STATIC_ROUTES,
} from "@/lib/frontend-revalidation/route-registry";

const DEFAULT_MAX_REVALIDATION_PATHS = 300;
const DEFAULT_SOURCE_LIMIT = 60;

type PublicSitemapResponse = {
  success?: unknown;
  data?: {
    entries?: unknown;
  };
};

type PublicSitemapEntry = {
  loc?: unknown;
};

const knownRootPaths = new Set<string>(PUBLIC_STATIC_ROUTES);

function flattenCategoryTree<T extends { children?: T[] }>(items: T[]): T[] {
  return items.flatMap((item) => [
    item,
    ...flattenCategoryTree(item.children ?? []),
  ]);
}

export type PublicRevalidationPathSources = Record<string, string[]>;

export type PublicRevalidationPathExpansion = {
  paths: string[];
  sources: PublicRevalidationPathSources;
  requiredStaticPaths: string[];
  missingRequiredStaticPaths: string[];
  errors: string[];
};

export type CollectPublicRevalidationPathsOptions = {
  includeStatic?: boolean;
  includeCatalog?: boolean;
  includePosts?: boolean;
  includePages?: boolean;
  includeSitemap?: boolean;
  limit?: number;
};

function isSafePublicPath(path: string): boolean {
  const normalized = path.trim();
  const lowerPath = normalized.toLowerCase();

  return (
    normalized.startsWith("/") &&
    !normalized.startsWith("//") &&
    !lowerPath.includes("http://") &&
    !lowerPath.includes("https://") &&
    !normalized.includes("?") &&
    !normalized.includes("#") &&
    !lowerPath.startsWith("/api") &&
    !lowerPath.startsWith("/debug") &&
    !lowerPath.startsWith("/dashboard") &&
    !lowerPath.startsWith("/admin") &&
    !lowerPath.startsWith("/god") &&
    !lowerPath.startsWith("/user")
  );
}

function normalizePublicPath(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let pathname = trimmed;

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      pathname = new URL(trimmed).pathname;
    }
  } catch {
    return null;
  }

  pathname = pathname.split("?")[0]?.split("#")[0] ?? "";
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
  }

  return isSafePublicPath(pathname) ? pathname : null;
}

function pushPath(
  sources: PublicRevalidationPathSources,
  source: string,
  value: string | null,
) {
  if (!value) return;
  sources[source] = sources[source] ?? [];
  sources[source].push(value);
}

function dedupeSourcePaths(
  sources: PublicRevalidationPathSources,
  errors: string[],
  limit: number,
) {
  const seen = new Set<string>();
  const limitedSources: PublicRevalidationPathSources = {};
  const paths: string[] = [];

  for (const [source, values] of Object.entries(sources)) {
    limitedSources[source] = [];

    for (const value of values) {
      const normalized = normalizePublicPath(value);
      if (!normalized) continue;

      limitedSources[source].push(normalized);
      if (seen.has(normalized)) continue;
      if (paths.length >= limit) {
        errors.push(
          `Path expansion reached limit ${limit}; remaining paths were skipped.`,
        );
        return { paths, sources: limitedSources };
      }

      seen.add(normalized);
      paths.push(normalized);
    }
  }

  return { paths, sources: limitedSources };
}

function getRequiredStaticPaths(): string[] {
  return PUBLIC_REQUIRED_ROOT_ROUTES.map((path) =>
    normalizePublicPath(path),
  ).filter((path): path is string => Boolean(path));
}

function getMissingRequiredStaticPaths(paths: string[]) {
  const pathSet = new Set(paths);
  return getRequiredStaticPaths().filter((path) => !pathSet.has(path));
}

async function collectSitemapPaths(
  sources: PublicRevalidationPathSources,
  errors: string[],
) {
  try {
    const payload = await publicApiFetch<PublicSitemapResponse>(
      "/api/public/sitemap",
      {
        next: { tags: [cacheTags.sitemap] },
      },
    );
    const entries = Array.isArray(payload.data?.entries)
      ? payload.data.entries
      : [];

    for (const entry of entries as PublicSitemapEntry[]) {
      if (typeof entry.loc !== "string") continue;
      const path = normalizePublicPath(entry.loc);
      if (!path) continue;

      pushPath(sources, knownRootPaths.has(path) ? "sitemap" : "pages", path);
    }
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Failed to collect sitemap paths: ${error.message}`
        : "Failed to collect sitemap paths.",
    );
  }
}

async function collectCatalogPaths(
  sources: PublicRevalidationPathSources,
  errors: string[],
  limit: number,
) {
  for (const path of CATALOG_ROOT_ROUTES) {
    pushPath(sources, "catalog", normalizePublicPath(path));
  }

  try {
    const result = await getCatalogItems({ limit, sort: "sort_order" });
    for (const item of result.items) {
      pushPath(
        sources,
        "catalog",
        normalizePublicPath(`/dich-vu/${item.slug}`),
      );
    }
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Failed to collect catalog paths: ${error.message}`
        : "Failed to collect catalog paths.",
    );
  }

  try {
    const categories = await getCatalogCategories();
    for (const category of flattenCategoryTree(categories)) {
      pushPath(
        sources,
        "catalog",
        normalizePublicPath(`/danh-muc/${category.slug}`),
      );
    }
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Failed to collect catalog category paths: ${error.message}`
        : "Failed to collect catalog category paths.",
    );
  }
}

async function collectPostPaths(
  sources: PublicRevalidationPathSources,
  errors: string[],
) {
  for (const path of POSTS_ROOT_ROUTES) {
    pushPath(sources, "posts", normalizePublicPath(path));
  }

  try {
    const posts = await getBlogPosts();
    for (const post of posts) {
      pushPath(sources, "posts", normalizePublicPath(`/bai-viet/${post.slug}`));
    }
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Failed to collect post paths: ${error.message}`
        : "Failed to collect post paths.",
    );
  }

  try {
    const categories = await getPostCategories();
    for (const category of flattenCategoryTree(categories)) {
      pushPath(
        sources,
        "posts",
        normalizePublicPath(`/chuyen-muc/${category.slug}`),
      );
    }
  } catch (error) {
    errors.push(
      error instanceof Error
        ? `Failed to collect post category paths: ${error.message}`
        : "Failed to collect post category paths.",
    );
  }
}

export async function collectPublicRevalidationPaths(
  options: CollectPublicRevalidationPathsOptions = {},
): Promise<PublicRevalidationPathExpansion> {
  const limit = Math.max(1, options.limit ?? DEFAULT_MAX_REVALIDATION_PATHS);
  const sourceLimit = Math.min(DEFAULT_SOURCE_LIMIT, limit);
  const errors: string[] = [];
  const sources: PublicRevalidationPathSources = {};

  if (options.includeStatic !== false) {
    for (const path of PUBLIC_STATIC_ROUTES) {
      pushPath(sources, "static", normalizePublicPath(path));
    }
  }

  await Promise.all([
    options.includeSitemap === false
      ? Promise.resolve()
      : collectSitemapPaths(sources, errors),
    options.includeCatalog === false
      ? Promise.resolve()
      : collectCatalogPaths(sources, errors, sourceLimit),
    options.includePosts === false
      ? Promise.resolve()
      : collectPostPaths(sources, errors),
  ]);

  if (options.includePages === false && sources.pages) {
    delete sources.pages;
  }

  const deduped = dedupeSourcePaths(sources, errors, limit);
  const requiredStaticPaths =
    options.includeStatic === false ? [] : getRequiredStaticPaths();

  return {
    ...deduped,
    requiredStaticPaths,
    missingRequiredStaticPaths:
      options.includeStatic === false
        ? []
        : getMissingRequiredStaticPaths(deduped.paths),
    errors,
  };
}
