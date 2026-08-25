import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { getDiscountedCatalogItems } from "@/features/catalog/services/catalog.service";

type DiscountedProductsProps = {
  limit?: number;
};

export async function DiscountedProducts({ limit = 4 }: DiscountedProductsProps) {
  const products = await getDiscountedCatalogItems(limit);
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-950">Sản phẩm ưu đãi</h2>
      <ProductGrid products={products} />
    </section>
  );
}
