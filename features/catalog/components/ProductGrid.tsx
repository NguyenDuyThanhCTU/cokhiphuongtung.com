import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { CatalogItem, ProductCtaMode } from "@/features/catalog/types";

type ProductGridProps = {
  products: CatalogItem[];
  ctaMode?: ProductCtaMode;
};

export function ProductGrid({ products, ctaMode = "detail" }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title="Chưa có sản phẩm hoặc dịch vụ nào." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} ctaMode={ctaMode} />
      ))}
    </div>
  );
}
