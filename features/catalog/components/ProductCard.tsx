import { Card } from "@/components/ui/Card";
import { ImageFallback } from "@/components/ui/ImageFallback";
import { ProductBadges } from "@/features/catalog/components/ProductBadges";
import { ProductCta } from "@/features/catalog/components/ProductCta";
import { ProductPrice } from "@/features/catalog/components/ProductPrice";
import type { CatalogItem, ProductCtaMode } from "@/features/catalog/types";
import { getProductPrimaryImage } from "@/features/catalog/utils/get-product-primary-image";
import { cn } from "@/lib/utils/cn";

export type ProductCardProps = {
  product: CatalogItem;
  ctaMode?: ProductCtaMode;
  className?: string;
};

export function ProductCard({ product, ctaMode = "detail", className }: ProductCardProps) {
  return (
    <Card className={cn("flex h-full flex-col overflow-hidden p-0", className)}>
      <ImageFallback
        src={getProductPrimaryImage(product)}
        alt={product.title}
        width={480}
        height={320}
        className="h-48 w-full rounded-t-lg object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <ProductBadges product={product} />
        <h2 className="mt-3 text-base font-semibold text-zinc-950">{product.title}</h2>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {product.shortDescription}
          </p>
        ) : null}
        <ProductPrice
          className="mt-4"
          price={product.price}
          finalPrice={product.finalPrice}
          discountPercent={product.discountPercent}
        />
        <ProductCta slug={product.slug} mode={ctaMode} className="mt-5" />
      </div>
    </Card>
  );
}
