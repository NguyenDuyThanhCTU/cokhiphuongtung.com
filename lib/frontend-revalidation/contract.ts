import { z } from "zod";
import { cacheTags } from "@/lib/cache/cache-tags";
import { FRONTEND_REVALIDATION_CONTRACT_VERSION } from "./constants";
import type { FrontendRevalidationRequestV2 } from "./types";

export { FRONTEND_REVALIDATION_CONTRACT_VERSION } from "./constants";

const MAX_ITEMS = 50;

export type RevalidationContractVersion =
  | typeof FRONTEND_REVALIDATION_CONTRACT_VERSION
  | "legacy";

export type RevalidationContractMeta = {
  contractVersion?: string;
  dedupeKey?: string;
  revalidateScope?: string;
  entityType?: string;
  operation?: string;
  slug?: string;
  oldSlug?: string;
  newSlug?: string;
  categorySlug?: string;
  oldCategorySlug?: string;
  newCategorySlug?: string;
  tagSlugs: string[];
  oldTagSlugs: string[];
  newTagSlugs: string[];
  affectedEntities: unknown[];
  affectedScopes: string[];
  legacyPaths: string[];
};

export type NormalizedRevalidationContract = {
  eventId?: string;
  websiteId?: string;
  event: string;
  module?: string;
  paths: string[];
  tags: string[];
  scopes: string[];
  source?: string;
  timestamp?: string;
  contractVersion: RevalidationContractVersion;
  meta: RevalidationContractMeta;
};

const requiredString = z.string().trim().min(1);
const stringArray = z.array(requiredString).max(MAX_ITEMS);
const v2MetaSchema = z
  .object({
    contractVersion: z.literal(FRONTEND_REVALIDATION_CONTRACT_VERSION),
    entityType: requiredString.optional(),
    operation: requiredString.optional(),
    slug: requiredString.optional(),
    oldSlug: requiredString.optional(),
    newSlug: requiredString.optional(),
    legacyPaths: stringArray.optional(),
    affectedScopes: stringArray.optional(),
    dedupeKey: requiredString.optional(),
    entityId: requiredString.optional(),
    entityRevision: requiredString.optional(),
  })
  .catchall(z.unknown());

export const frontendRevalidationRequestV2Schema: z.ZodType<FrontendRevalidationRequestV2> =
  z.object({
    eventId: requiredString,
    websiteId: requiredString,
    event: requiredString,
    module: requiredString,
    paths: stringArray,
    tags: stringArray,
    scopes: stringArray,
    source: z.literal("dashboard-admin"),
    timestamp: requiredString,
    meta: v2MetaSchema,
  });

export function parseV2RevalidationContract(
  payload: unknown,
): FrontendRevalidationRequestV2 {
  return frontendRevalidationRequestV2Schema.parse(payload);
}

export function isV2RevalidationRequest(
  payload: unknown,
): payload is FrontendRevalidationRequestV2 {
  return frontendRevalidationRequestV2Schema.safeParse(payload).success;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function readString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeStringArray(value: unknown, limit = MAX_ITEMS): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const output: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") continue;
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    output.push(normalized);
    if (output.length >= limit) break;
  }

  return output;
}

function normalizeOptionalLower(value: string | undefined): string | undefined {
  return value?.trim().toLowerCase() || undefined;
}

export function parseRevalidationContract(
  payload: unknown,
): NormalizedRevalidationContract {
  const record = asRecord(payload);
  const metaRecord = asRecord(record.meta);
  const event = readString(record, "event") ?? "manual.site.revalidate";
  const metaContractVersion = readString(metaRecord, "contractVersion");
  const contractVersion: RevalidationContractVersion =
    metaContractVersion === FRONTEND_REVALIDATION_CONTRACT_VERSION
      ? FRONTEND_REVALIDATION_CONTRACT_VERSION
      : "legacy";

  return {
    eventId: readString(record, "eventId"),
    websiteId: readString(record, "websiteId"),
    event: event.trim(),
    module: normalizeOptionalLower(readString(record, "module")),
    paths: normalizeStringArray(record.paths),
    tags: normalizeStringArray(record.tags).map((tag) => tag.toLowerCase()),
    scopes: normalizeStringArray(record.scopes).map((scope) =>
      scope.toLowerCase(),
    ),
    source: readString(record, "source"),
    timestamp: readString(record, "timestamp"),
    contractVersion,
    meta: {
      contractVersion: metaContractVersion,
      dedupeKey: readString(metaRecord, "dedupeKey"),
      revalidateScope: normalizeOptionalLower(
        readString(metaRecord, "revalidateScope"),
      ),
      entityType: normalizeOptionalLower(readString(metaRecord, "entityType")),
      operation: normalizeOptionalLower(readString(metaRecord, "operation")),
      slug: readString(metaRecord, "slug") ?? readString(record, "slug"),
      oldSlug:
        readString(metaRecord, "oldSlug") ?? readString(record, "oldSlug"),
      newSlug:
        readString(metaRecord, "newSlug") ?? readString(record, "newSlug"),
      categorySlug:
        readString(metaRecord, "categorySlug") ??
        readString(record, "categorySlug"),
      oldCategorySlug:
        readString(metaRecord, "oldCategorySlug") ??
        readString(record, "oldCategorySlug"),
      newCategorySlug:
        readString(metaRecord, "newCategorySlug") ??
        readString(record, "newCategorySlug"),
      tagSlugs: normalizeStringArray(metaRecord.tagSlugs),
      oldTagSlugs: normalizeStringArray(metaRecord.oldTagSlugs),
      newTagSlugs: normalizeStringArray(metaRecord.newTagSlugs),
      affectedEntities: Array.isArray(metaRecord.affectedEntities)
        ? metaRecord.affectedEntities.slice(0, MAX_ITEMS)
        : [],
      affectedScopes: normalizeStringArray(metaRecord.affectedScopes).map(
        (scope) => scope.toLowerCase(),
      ),
      legacyPaths: normalizeStringArray(metaRecord.legacyPaths),
    },
  };
}

function includesAny(value: string | undefined, needles: string[]): boolean {
  const normalized = value?.toLowerCase() ?? "";
  return needles.some((needle) => normalized.includes(needle));
}

function hasAny(values: string[], needles: string[]): boolean {
  const set = new Set(values.map((value) => value.toLowerCase()));
  return needles.some((needle) => set.has(needle));
}

function hasAll(values: string[], needles: string[]): boolean {
  const set = new Set(values.map((value) => value.toLowerCase()));
  return needles.every((needle) => set.has(needle));
}

function pathHasAny(paths: string[], prefixes: string[]): boolean {
  return paths.some((path) => {
    const normalized = path.toLowerCase();
    return prefixes.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
    );
  });
}

export function getEntitySlugs(
  contract: NormalizedRevalidationContract,
): string[] {
  return normalizeStringArray([
    contract.meta.slug,
    contract.meta.oldSlug,
    contract.meta.newSlug,
  ]);
}

export function getCategorySlugs(
  contract: NormalizedRevalidationContract,
): string[] {
  return normalizeStringArray([
    contract.meta.categorySlug,
    contract.meta.oldCategorySlug,
    contract.meta.newCategorySlug,
  ]);
}

export function getAllSignalPaths(
  contract: NormalizedRevalidationContract,
): string[] {
  return normalizeStringArray([
    ...contract.paths,
    ...contract.meta.legacyPaths,
  ]);
}

export function isHealthCheck(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.event === "health.check" ||
    contract.meta.revalidateScope === "health"
  );
}

export function isFullSiteEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.event === "manual.full-site.revalidate" ||
    contract.event === "manual.site.revalidate" ||
    contract.event === "full-site.revalidate" ||
    contract.meta.revalidateScope === "full-site" ||
    hasAny(contract.scopes, ["full-site"]) ||
    includesAny(contract.event, ["full-site", "full_site", "fullsite"]) ||
    hasAll(contract.tags, [
      cacheTags.settings,
      cacheTags.catalog,
      cacheTags.posts,
      cacheTags.pages,
      cacheTags.sitemap,
    ])
  );
}

export function isHomeEvent(contract: NormalizedRevalidationContract): boolean {
  return (
    contract.meta.revalidateScope === "home" ||
    contract.event === "manual.home.revalidate" ||
    includesAny(contract.event, ["banner", "testimonial"]) ||
    hasAny(contract.tags, [
      cacheTags.home,
      cacheTags.banners,
      cacheTags.testimonials,
    ]) ||
    hasAny(contract.scopes, [
      cacheTags.home,
      cacheTags.banners,
      cacheTags.testimonials,
    ]) ||
    hasAny(contract.meta.affectedScopes, [
      cacheTags.home,
      cacheTags.banners,
      cacheTags.testimonials,
    ])
  );
}

export function isGlobalEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "global" ||
    contract.meta.entityType === "settings" ||
    contract.event === "settings.updated" ||
    includesAny(contract.event, [
      "settings",
      "site",
      "website",
      "contact",
      "hotline",
      "navigation",
    ]) ||
    hasAny(contract.tags, [
      cacheTags.site,
      cacheTags.settings,
      cacheTags.navigation,
    ]) ||
    hasAny(contract.scopes, [
      cacheTags.site,
      cacheTags.settings,
      cacheTags.navigation,
      "theme",
      "global",
      "full-site",
    ]) ||
    hasAny(contract.meta.affectedScopes, [
      cacheTags.site,
      cacheTags.settings,
      cacheTags.navigation,
      "theme",
      "global",
      "full-site",
    ])
  );
}

export function isCatalogEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "catalog" ||
    hasAny(contract.scopes, [
      cacheTags.catalog,
      cacheTags.catalogCategories,
      cacheTags.catalogTags,
    ]) ||
    contract.meta.entityType === "catalog-item" ||
    contract.meta.entityType === "catalog-category" ||
    contract.meta.entityType === "catalog-tag" ||
    contract.module === "catalog" ||
    includesAny(contract.event, ["catalog"]) ||
    hasAny(contract.tags, [
      cacheTags.catalog,
      cacheTags.catalogCategories,
      cacheTags.catalogTags,
    ]) ||
    hasAny(contract.meta.affectedScopes, [
      cacheTags.catalog,
      cacheTags.catalogCategories,
      cacheTags.catalogTags,
    ]) ||
    pathHasAny(getAllSignalPaths(contract), ["/products", "/san-pham"])
  );
}

export function isPostsEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "posts" ||
    hasAny(contract.scopes, [cacheTags.posts]) ||
    contract.meta.entityType === "post" ||
    contract.module === "posts" ||
    includesAny(contract.event, ["post", "posts", "blog", "content"]) ||
    hasAny(contract.tags, [cacheTags.posts]) ||
    hasAny(contract.meta.affectedScopes, [cacheTags.posts]) ||
    pathHasAny(getAllSignalPaths(contract), ["/blog", "/bai-viet"])
  );
}

export function isPostCategoriesEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "post-categories" ||
    hasAny(contract.scopes, [cacheTags.postCategories]) ||
    contract.meta.entityType === "post-category" ||
    hasAny(contract.tags, [cacheTags.postCategories]) ||
    hasAny(contract.meta.affectedScopes, [cacheTags.postCategories])
  );
}

export function isPostTagsEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "post-tags" ||
    hasAny(contract.scopes, [cacheTags.postTags]) ||
    contract.meta.entityType === "post-tag" ||
    hasAny(contract.tags, [cacheTags.postTags]) ||
    hasAny(contract.meta.affectedScopes, [cacheTags.postTags])
  );
}

export function isPagesEvent(
  contract: NormalizedRevalidationContract,
): boolean {
  return (
    contract.meta.revalidateScope === "pages" ||
    hasAny(contract.scopes, [cacheTags.pages]) ||
    contract.meta.entityType === "page" ||
    contract.module === "pages" ||
    includesAny(contract.event, ["page", "pages"]) ||
    hasAny(contract.tags, [cacheTags.pages]) ||
    hasAny(contract.meta.affectedScopes, [cacheTags.pages])
  );
}

export function isFaqEvent(contract: NormalizedRevalidationContract): boolean {
  return (
    contract.meta.revalidateScope === "faq" ||
    hasAny(contract.scopes, [cacheTags.faq]) ||
    contract.meta.entityType === "faq" ||
    contract.module === "faq" ||
    includesAny(contract.event, ["faq"]) ||
    hasAny(contract.tags, [cacheTags.faq]) ||
    hasAny(contract.meta.affectedScopes, [cacheTags.faq])
  );
}
