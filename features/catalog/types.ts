import type {
  ID,
  ISODateString,
  PublishStatus,
  UrlString,
} from "@/lib/types/shared";

export type CatalogCategory = {
  id: ID;
  name: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: UrlString | null;
  imageUrl?: UrlString | null;
  parentId?: ID | null;
  children?: CatalogCategory[];
  sortOrder?: number;
  isActive?: boolean;
};

export type CatalogTag = {
  id: ID;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type CatalogJsonValue =
  | string
  | number
  | boolean
  | null
  | CatalogJsonValue[]
  | { [key: string]: CatalogJsonValue };

export type CatalogSpecification = {
  key: string;
  label: string;
  value: string;
  sortOrder: number;
  isVisible: boolean;
};

export type CatalogVariant = {
  id: ID;
  sku?: string | null;
  title?: string | null;
  name?: string | null;
  size?: string | null;
  color?: string | null;
  volume?: string | null;
  optionValues?: CatalogJsonValue;
  price?: number | null;
  discountPercent?: number | null;
  salePrice?: number | null;
  finalPrice?: number | null;
  stockQuantity?: number | null;
  stock?: number | null;
  imageUrl?: UrlString | null;
  isActive?: boolean;
  sortOrder?: number;
};

export type CatalogItem = {
  id: ID;
  websiteId?: ID;
  title: string;
  slug: string;
  sku?: string | null;
  specs?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | null;
  priceText?: string | null;
  comparePrice?: number | null;
  salePrice?: number | null;
  discountPercent?: number | null;
  /** Backward-compatible alias of salePrice. */
  finalPrice?: number | null;
  thumbnailUrl?: UrlString | null;
  gallery?: UrlString[];
  /** Backward-compatible alias of gallery. */
  galleryUrls?: UrlString[];
  trackInventory?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number | null;
  hasVariants?: boolean;
  variantOptions?: CatalogJsonValue;
  attributes?: CatalogJsonValue;
  specifications?: CatalogSpecification[];
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  category?: CatalogCategory | null;
  categoryId?: ID | null;
  categories?: CatalogCategory[];
  tags?: CatalogTag[];
  variants?: CatalogVariant[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isRecommended?: boolean;
  isOnSale?: boolean;
  /** Backward-compatible alias of isOnSale. */
  isDiscounted?: boolean;
  status?: PublishStatus;
  sortOrder?: number;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: UrlString | null;
};

export type CatalogSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "sort_order";

export type CatalogListSearchParams = {
  page?: any;
  limit?: string;
  q?: string;
  category?: string;
  tag?: string;
  featured?: string;
  bestSeller?: string;
  discounted?: string;
  sort?: CatalogSortOption;
};

export type CatalogListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  bestSeller?: boolean;
  discounted?: boolean;
  sort?: CatalogSortOption;
};

export type CatalogListResult = {
  items: CatalogItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductCtaMode = "detail" | "contact" | "disabled";
