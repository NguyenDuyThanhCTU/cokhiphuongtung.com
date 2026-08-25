import type { CatalogItem, CatalogVariant } from "@/features/catalog/types";
import { formatPrice } from "@/lib/utils/format-price";

type PriceSource = Pick<CatalogItem | CatalogVariant, "price" | "finalPrice">;

export function getProductPriceLabel(
  product: PriceSource,
  fallbackLabel: string = "Liên hệ",
): string {
  if (typeof product.finalPrice === "number" && Number.isFinite(product.finalPrice)) {
    return formatPrice(product.finalPrice);
  }

  if (typeof product.price === "number" && Number.isFinite(product.price)) {
    return formatPrice(product.price);
  }

  return fallbackLabel;
}
