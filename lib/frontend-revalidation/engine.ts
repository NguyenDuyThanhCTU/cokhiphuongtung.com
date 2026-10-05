import { revalidatePath, revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache/cache-tags";
import { invalidateHomeCatalog } from "@/features/catalog/services/home-catalog.service";
import {
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
  expandRevalidationRoutes,
  normalizePublicRevalidationPath,
  type RevalidationPathExpansion,
} from "@/lib/frontend-revalidation/route-expansion";

export { RECEIVER_VERSION } from "./constants";

export const allowedRevalidationTags = new Set<string>([
  cacheTags.site,
  cacheTags.settings,
  cacheTags.navigation,
  cacheTags.home,
  cacheTags.sitemap,
  cacheTags.catalog,
  cacheTags.catalogCategories,
  cacheTags.catalogTags,
  cacheTags.posts,
  cacheTags.postCategories,
  cacheTags.postTags,
  cacheTags.pages,
  cacheTags.faq,
  cacheTags.testimonials,
  cacheTags.banners,
  cacheTags.promotions,
  cacheTags.bookingServices,
]);

export type RevalidationEngineResult = {
  requestedTags: string[];
  requestedPaths: string[];
  revalidatedTags: string[];
  revalidatedPaths: string[];
  revalidatedPatterns: string[];
  ignoredTags: string[];
  ignoredPaths: string[];
  layoutRevalidated: boolean;
  isGlobalEvent: boolean;
  pathExpansion: RevalidationPathExpansion;
};

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function addTags(tags: string[], values: string[]) {
  tags.push(...values.filter((tag) => allowedRevalidationTags.has(tag)));
}

export function resolveSemanticTags(
  contract: NormalizedRevalidationContract,
): string[] {
  const tags = [...contract.tags];

  if (isFullSiteEvent(contract)) {
    addTags(tags, [
      cacheTags.site,
      cacheTags.settings,
      cacheTags.navigation,
      cacheTags.home,
      cacheTags.sitemap,
      cacheTags.catalog,
      cacheTags.catalogCategories,
      cacheTags.catalogTags,
      cacheTags.posts,
      cacheTags.postCategories,
      cacheTags.postTags,
      cacheTags.pages,
      cacheTags.faq,
      cacheTags.testimonials,
      cacheTags.banners,
    ]);
  }

  if (isGlobalEvent(contract)) {
    addTags(tags, [
      cacheTags.site,
      cacheTags.settings,
      cacheTags.navigation,
      cacheTags.home,
    ]);
  }

  if (isHomeEvent(contract)) addTags(tags, [cacheTags.home]);

  if (isCatalogEvent(contract)) {
    addTags(tags, [
      cacheTags.catalog,
      cacheTags.catalogCategories,
      cacheTags.catalogTags,
    ]);
  }

  if (
    isPostsEvent(contract) ||
    isPostCategoriesEvent(contract) ||
    isPostTagsEvent(contract)
  ) {
    addTags(tags, [
      cacheTags.posts,
      cacheTags.postCategories,
      cacheTags.postTags,
    ]);
  }

  if (isPagesEvent(contract)) addTags(tags, [cacheTags.pages]);
  if (isFaqEvent(contract)) addTags(tags, [cacheTags.faq]);

  return uniqueStrings(tags);
}

export type RevalidationEngineDependencies = {
  invalidateTag: (tag: string) => void;
  invalidatePath: (path: string, type?: "layout" | "page") => void;
  expandRoutes: (
    contract: NormalizedRevalidationContract,
  ) => Promise<RevalidationPathExpansion>;
};

const defaultDependencies: RevalidationEngineDependencies = {
  invalidateTag: revalidateTag,
  invalidatePath: revalidatePath,
  expandRoutes: expandRevalidationRoutes,
};

export async function runRevalidationEngine(
  contract: NormalizedRevalidationContract,
  dependencies: RevalidationEngineDependencies = defaultDependencies,
): Promise<RevalidationEngineResult> {
  const requestedTags = uniqueStrings(contract.tags);
  const requestedPaths = uniqueStrings(contract.paths);
  const resolvedTags = resolveSemanticTags(contract);
  const revalidatedTags = resolvedTags.filter((tag) =>
    allowedRevalidationTags.has(tag),
  );
  const ignoredTags = requestedTags.filter(
    (tag) => !allowedRevalidationTags.has(tag),
  );
  const ignoredPaths = requestedPaths.filter(
    (path) => !normalizePublicRevalidationPath(path),
  );

  if (revalidatedTags.includes(cacheTags.catalog) || revalidatedTags.includes(cacheTags.home)) {
    invalidateHomeCatalog();
  }

  for (const tag of revalidatedTags) {
    dependencies.invalidateTag(tag);
  }

  const pathExpansion = await dependencies.expandRoutes(contract);
  const revalidatedPaths = uniqueStrings(pathExpansion.paths);
  const revalidatedPatterns = uniqueStrings(pathExpansion.dynamicPatterns);
  const layoutRevalidated = pathExpansion.layoutRevalidate;

  for (const path of revalidatedPaths) {
    dependencies.invalidatePath(path);
  }

  for (const pattern of revalidatedPatterns) {
    dependencies.invalidatePath(pattern, "page");
  }

  if (layoutRevalidated) {
    dependencies.invalidatePath("/", "layout");
  }

  return {
    requestedTags,
    requestedPaths,
    revalidatedTags,
    revalidatedPaths,
    revalidatedPatterns,
    ignoredTags,
    ignoredPaths,
    layoutRevalidated,
    isGlobalEvent: isGlobalEvent(contract) || isFullSiteEvent(contract),
    pathExpansion,
  };
}
