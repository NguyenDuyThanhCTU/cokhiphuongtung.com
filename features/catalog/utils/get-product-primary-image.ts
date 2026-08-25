import type { CatalogItem } from "@/features/catalog/types";

export function getProductPrimaryImage(product: CatalogItem): string | null {
  if (product.thumbnailUrl) {
    return product.thumbnailUrl;
  }

  return product.galleryUrls?.find(Boolean) ?? null;
}
