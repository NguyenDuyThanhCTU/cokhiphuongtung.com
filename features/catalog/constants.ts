import type { CatalogSortOption } from "@/features/catalog/types";

export const catalogSortOptions: Array<{ value: CatalogSortOption; label: string }> = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "sort_order", label: "Sắp xếp mặc định" },
];
