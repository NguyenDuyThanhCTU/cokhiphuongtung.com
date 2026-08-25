import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import { cn } from "@/lib/utils/cn";

type ProductPriceProps = {
  price?: number | null;
  finalPrice?: number | null;
  discountPercent?: number | null;
  fallbackLabel?: string;
  className?: string;
};

export function ProductPrice({
  price,
  finalPrice,
  discountPercent,
  fallbackLabel = "Liên hệ",
  className,
}: ProductPriceProps) {
  const hasFinalPrice = typeof finalPrice === "number" && Number.isFinite(finalPrice);
  const hasPrice = typeof price === "number" && Number.isFinite(price);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-base font-semibold text-zinc-950">
        {getProductPriceLabel({ price, finalPrice }, fallbackLabel)}
      </span>
      {hasFinalPrice && hasPrice && finalPrice !== price ? (
        <span className="text-sm text-zinc-500 line-through">
          {getProductPriceLabel({ price, finalPrice: null })}
        </span>
      ) : null}
      {discountPercent ? (
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
          -{discountPercent}%
        </span>
      ) : null}
    </div>
  );
}
