import { z } from "zod";
import {
  idSchema,
  nullableUrlSchema,
  optionalStringSchema,
} from "@/lib/schemas/shared.schema";
import type {
  CatalogCategory,
  CatalogItem,
  CatalogJsonValue,
  CatalogSpecification,
  CatalogTag,
  CatalogVariant,
} from "@/features/catalog/types";

function optionalNumber() {
  return z.preprocess((value) => {
    if (value === "" || value === undefined) return undefined;
    if (value === null) return null;
    return value;
  }, z.coerce.number().nullable().optional());
}

function booleanFromQuery() {
  return z.preprocess((value) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false || value === "" || value == null)
      return undefined;
    return value;
  }, z.boolean().optional());
}

export const catalogSortOptionSchema = z.enum([
  "newest",
  "price_asc",
  "price_desc",
  "sort_order",
]);

export const catalogListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(60).optional(),
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  featured: booleanFromQuery(),
  bestSeller: booleanFromQuery(),
  discounted: booleanFromQuery(),
  sort: catalogSortOptionSchema.optional(),
});

const catalogJsonValueSchema: z.ZodType<CatalogJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(catalogJsonValueSchema),
    z.record(z.string(), catalogJsonValueSchema),
  ]),
);

export const catalogCategorySchema: z.ZodType<CatalogCategory> = z.lazy(() =>
  z.object({
    id: idSchema,
    name: z.string().min(1),
    slug: z.string().min(1),
    description: optionalStringSchema.nullable().optional(),
    thumbnailUrl: nullableUrlSchema,
    imageUrl: nullableUrlSchema,
    parentId: idSchema.nullable().optional(),
    children: z.array(catalogCategorySchema).optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
);

export const catalogTagSchema: z.ZodType<CatalogTag> = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  description: optionalStringSchema.nullable().optional(),
  color: optionalStringSchema.nullable().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const catalogVariantSchema: z.ZodType<CatalogVariant> = z.object({
  id: idSchema,
  sku: optionalStringSchema.nullable().optional(),
  title: optionalStringSchema.nullable().optional(),
  name: optionalStringSchema.nullable().optional(),
  size: optionalStringSchema.nullable().optional(),
  color: optionalStringSchema.nullable().optional(),
  volume: optionalStringSchema.nullable().optional(),
  optionValues: catalogJsonValueSchema.optional(),
  price: optionalNumber(),
  discountPercent: optionalNumber(),
  salePrice: optionalNumber(),
  finalPrice: optionalNumber(),
  stockQuantity: optionalNumber(),
  stock: optionalNumber(),
  imageUrl: nullableUrlSchema,
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

const catalogSpecificationSchema: z.ZodType<CatalogSpecification> = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  sortOrder: z.number(),
  isVisible: z.boolean(),
});

export const catalogItemSchema: z.ZodType<CatalogItem> = z.object({
  id: idSchema,
  websiteId: idSchema.optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  sku: optionalStringSchema.nullable().optional(),
  specs: z.string().nullable().optional(),
  shortDescription: optionalStringSchema.nullable().optional(),
  description: z.string().nullable().optional(),
  price: optionalNumber(),
  priceText: optionalStringSchema.nullable().optional(),
  comparePrice: optionalNumber(),
  salePrice: optionalNumber(),
  discountPercent: optionalNumber(),
  finalPrice: optionalNumber(),
  thumbnailUrl: nullableUrlSchema,
  gallery: z.array(z.string().min(1)).optional().default([]),
  galleryUrls: z.array(z.string().min(1)).optional().default([]),
  trackInventory: z.boolean().optional(),
  stockQuantity: z.number().optional(),
  lowStockThreshold: optionalNumber(),
  hasVariants: z.boolean().optional(),
  variantOptions: catalogJsonValueSchema.optional(),
  attributes: catalogJsonValueSchema.optional(),
  specifications: z.array(catalogSpecificationSchema).optional().default([]),
  ctaLabel: optionalStringSchema.nullable().optional(),
  ctaUrl: optionalStringSchema.nullable().optional(),
  category: catalogCategorySchema.nullable().optional(),
  categoryId: idSchema.nullable().optional(),
  categories: z.array(catalogCategorySchema).optional().default([]),
  tags: z.array(catalogTagSchema).optional().default([]),
  variants: z.array(catalogVariantSchema).optional().default([]),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  isDiscounted: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  sortOrder: z.number().optional(),
  createdAt: z.string().min(1).optional(),
  updatedAt: z.string().min(1).optional(),
  seoTitle: optionalStringSchema.nullable().optional(),
  seoDescription: optionalStringSchema.nullable().optional(),
  ogImage: nullableUrlSchema,
});

export const catalogItemListSchema = z.array(catalogItemSchema);
export const catalogCategoryListSchema = z.array(catalogCategorySchema);
export const catalogTagListSchema = z.array(catalogTagSchema);
export const catalogVariantListSchema = z.array(catalogVariantSchema);
