import { Badge } from "@/components/ui/Badge";
import type { CatalogItem } from "@/features/catalog/types";

type ProductBadgesProps = {
  product: CatalogItem;
};

function getDiscountBadge(product: CatalogItem): string | null {
  if (typeof product.discountPercent === "number" && product.discountPercent > 0) {
    return `Giảm ${product.discountPercent}%`;
  }

  if (
    typeof product.price === "number" &&
    typeof product.finalPrice === "number" &&
    product.price > 0 &&
    product.finalPrice < product.price
  ) {
    return "Đang khuyến mãi";
  }

  return product.isDiscounted ? "Đang khuyến mãi" : null;
}

export function ProductBadges({ product }: ProductBadgesProps) {
  const badges = [
    product.isFeatured ? "Nổi bật" : null,
    product.isBestSeller ? "Bán chạy" : null,
    getDiscountBadge(product),
  ].filter((badge): badge is string => Boolean(badge));

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge key={badge}>{badge}</Badge>
      ))}
    </div>
  );
}
