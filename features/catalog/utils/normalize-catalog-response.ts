import {
  asArray,
  unwrapApiData,
  normalizeString,
} from "@/lib/utils/api-normalizers";
import type {
  CatalogCategory,
  CatalogItem,
  CatalogJsonValue,
  CatalogListResult,
  CatalogSpecification,
  CatalogTag,
  CatalogVariant,
} from "@/features/catalog/types";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function numberOrNull(value: unknown): number | null | undefined {
  if (value === "" || value == null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function booleanOrUndefined(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function jsonValueOrUndefined(value: unknown): CatalogJsonValue | undefined {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map(jsonValueOrUndefined)
      .filter((item): item is CatalogJsonValue => item !== undefined);
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, jsonValueOrUndefined(item)] as const)
        .filter(
          (entry): entry is readonly [string, CatalogJsonValue] =>
            entry[1] !== undefined,
        ),
    );
  }

  return undefined;
}

function normalizeCatalogSpecification(
  value: unknown,
  index: number,
): CatalogSpecification | null {
  const item = asRecord(value);
  const label = normalizeString(item.label) ?? normalizeString(item.name);
  const specificationValue = normalizeString(item.value);

  if (!label || !specificationValue) return null;

  return {
    key: normalizeString(item.key) ?? `specification-${index}`,
    label,
    value: specificationValue,
    sortOrder: numberOrNull(item.sortOrder) ?? index,
    isVisible: booleanOrUndefined(item.isVisible) ?? true,
  };
}

export function normalizeCatalogCategory(
  value: unknown,
  index: number = 0,
): CatalogCategory {
  const item = asRecord(value);
  return {
    id: normalizeString(item.id) ?? `category-${index}`,
    name:
      normalizeString(item.name) ?? normalizeString(item.title) ?? "Danh mục",
    slug:
      normalizeString(item.slug) ??
      normalizeString(item.id) ??
      `category-${index}`,
    description: normalizeString(item.description) ?? null,
    thumbnailUrl:
      normalizeString(item.thumbnailUrl) ??
      normalizeString(item.imageUrl) ??
      null,
    imageUrl:
      normalizeString(item.imageUrl) ??
      normalizeString(item.thumbnailUrl) ??
      null,
    parentId: normalizeString(item.parentId) ?? null,
    children: asArray(item.children).map((child, childIndex) =>
      normalizeCatalogCategory(child, childIndex),
    ),
    sortOrder: numberOrNull(item.sortOrder) ?? undefined,
    isActive: booleanOrUndefined(item.isActive),
  };
}

export function normalizeCatalogTag(
  value: unknown,
  index: number = 0,
): CatalogTag {
  const item = asRecord(value);
  return {
    id: normalizeString(item.id) ?? `tag-${index}`,
    name: normalizeString(item.name) ?? normalizeString(item.title) ?? "Tag",
    slug:
      normalizeString(item.slug) ?? normalizeString(item.id) ?? `tag-${index}`,
    description: normalizeString(item.description) ?? null,
    color: normalizeString(item.color) ?? null,
    sortOrder: numberOrNull(item.sortOrder) ?? undefined,
    isActive: booleanOrUndefined(item.isActive),
  };
}

export function normalizeCatalogVariant(
  value: unknown,
  index: number = 0,
): CatalogVariant {
  const item = asRecord(value);
  const title =
    normalizeString(item.title) ?? normalizeString(item.name) ?? null;
  const salePrice =
    numberOrNull(item.salePrice) ?? numberOrNull(item.finalPrice) ?? null;
  const stockQuantity =
    numberOrNull(item.stockQuantity) ?? numberOrNull(item.stock) ?? null;

  return {
    id: normalizeString(item.id) ?? `variant-${index}`,
    sku: normalizeString(item.sku) ?? null,
    title,
    name: normalizeString(item.name) ?? title,
    size: normalizeString(item.size) ?? null,
    color: normalizeString(item.color) ?? null,
    volume: normalizeString(item.volume) ?? null,
    optionValues: jsonValueOrUndefined(item.optionValues),
    price: numberOrNull(item.price) ?? null,
    discountPercent: numberOrNull(item.discountPercent) ?? null,
    salePrice,
    finalPrice: salePrice,
    stockQuantity,
    stock: stockQuantity,
    imageUrl: normalizeString(item.imageUrl) ?? null,
    isActive: booleanOrUndefined(item.isActive),
    sortOrder: numberOrNull(item.sortOrder) ?? undefined,
  };
}

export function normalizeCatalogItem(
  value: unknown,
  index: number = 0,
): CatalogItem {
  const item = asRecord(value);
  const category = item.category
    ? normalizeCatalogCategory(item.category)
    : null;
  const salePrice =
    numberOrNull(item.salePrice) ?? numberOrNull(item.finalPrice) ?? null;
  const gallerySource = Array.isArray(item.galleryUrls)
    ? item.galleryUrls
    : Array.isArray(item.gallery)
      ? item.gallery
      : item.images;
  const gallery = asArray(gallerySource)
    .map((image) => normalizeString(image))
    .filter((image): image is string => Boolean(image));
  const specifications = asArray(item.specifications)
    .map(normalizeCatalogSpecification)
    .filter(
      (specification): specification is CatalogSpecification =>
        specification !== null,
    );
  const isOnSale =
    booleanOrUndefined(item.isOnSale) ??
    booleanOrUndefined(item.isDiscounted) ??
    booleanOrUndefined(item.discounted);

  return {
    id: normalizeString(item.id) ?? `catalog-${index}`,
    websiteId: normalizeString(item.websiteId),
    title:
      normalizeString(item.title) ?? normalizeString(item.name) ?? "Sản phẩm",
    slug:
      normalizeString(item.slug) ??
      normalizeString(item.id) ??
      `catalog-${index}`,
    sku: normalizeString(item.sku) ?? null,
    specs: normalizeString(item.specs) ?? null,
    shortDescription:
      normalizeString(item.shortDescription) ??
      normalizeString(item.excerpt) ??
      null,
    description:
      normalizeString(item.description) ??
      normalizeString(item.content) ??
      null,
    price: numberOrNull(item.price) ?? null,
    priceText: normalizeString(item.priceText) ?? null,
    comparePrice: numberOrNull(item.comparePrice) ?? null,
    salePrice,
    discountPercent: numberOrNull(item.discountPercent) ?? null,
    finalPrice: salePrice,
    thumbnailUrl:
      normalizeString(item.thumbnailUrl) ??
      normalizeString(item.imageUrl) ??
      normalizeString(item.thumbnail) ??
      null,
    gallery,
    galleryUrls: gallery,
    trackInventory: booleanOrUndefined(item.trackInventory),
    stockQuantity: numberOrNull(item.stockQuantity) ?? undefined,
    lowStockThreshold: numberOrNull(item.lowStockThreshold) ?? null,
    hasVariants: booleanOrUndefined(item.hasVariants),
    variantOptions: jsonValueOrUndefined(item.variantOptions),
    attributes: jsonValueOrUndefined(item.attributes),
    specifications,
    ctaLabel: normalizeString(item.ctaLabel) ?? null,
    ctaUrl: normalizeString(item.ctaUrl) ?? null,
    category,
    categoryId: normalizeString(item.categoryId) ?? category?.id ?? null,
    categories: asArray(item.categories).map((value, childIndex) =>
      normalizeCatalogCategory(value, childIndex),
    ),
    tags: asArray(item.tags).map((value, childIndex) =>
      normalizeCatalogTag(value, childIndex),
    ),
    variants: asArray(item.variants).map((value, childIndex) =>
      normalizeCatalogVariant(value, childIndex),
    ),
    isFeatured:
      booleanOrUndefined(item.isFeatured) ?? booleanOrUndefined(item.featured),
    isBestSeller:
      booleanOrUndefined(item.isBestSeller) ??
      booleanOrUndefined(item.bestSeller),
    isNewArrival: booleanOrUndefined(item.isNewArrival),
    isRecommended: booleanOrUndefined(item.isRecommended),
    isOnSale,
    isDiscounted:
      booleanOrUndefined(item.isDiscounted) ??
      isOnSale ??
      booleanOrUndefined(item.discounted) ??
      (numberOrNull(item.discountPercent) ? true : undefined),
    status:
      item.status === "DRAFT" ||
      item.status === "PUBLISHED" ||
      item.status === "ARCHIVED"
        ? item.status
        : undefined,
    sortOrder: numberOrNull(item.sortOrder) ?? undefined,
    createdAt: normalizeString(item.createdAt),
    updatedAt: normalizeString(item.updatedAt),
    seoTitle: normalizeString(item.seoTitle) ?? null,
    seoDescription: normalizeString(item.seoDescription) ?? null,
    ogImage:
      normalizeString(item.ogImage) ??
      normalizeString(item.thumbnailUrl) ??
      null,
  };
}

export function normalizeCatalogListResponse(
  payload: unknown,
): CatalogListResult {
  const rootRecord = asRecord(payload);
  const unwrapped = unwrapApiData(payload);
  const unwrappedRecord = asRecord(unwrapped);

  const itemsSource = Array.isArray(unwrapped)
    ? unwrapped
    : asArray(unwrappedRecord.items);

  const items = itemsSource.map((item, index) =>
    normalizeCatalogItem(item, index),
  );

  const rootMetaRecord = asRecord(rootRecord.meta);
  const nestedMetaRecord = asRecord(unwrappedRecord.meta);

  const metaRecord =
    Object.keys(rootMetaRecord).length > 0 ? rootMetaRecord : nestedMetaRecord;

  return {
    items,
    meta:
      Object.keys(metaRecord).length > 0
        ? {
            page: toSafeNumber(metaRecord.page, 1),
            limit: toSafeNumber(metaRecord.limit, items.length || 12),
            total: toSafeNumber(metaRecord.total, items.length),
            totalPages: toSafeNumber(metaRecord.totalPages, 1),
          }
        : undefined,
  };
}

function toSafeNumber(value: unknown, fallback: number): number {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}
