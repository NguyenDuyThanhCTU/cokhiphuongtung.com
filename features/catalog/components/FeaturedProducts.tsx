import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { getFeaturedCatalogItems } from "@/features/catalog/services/catalog.service";

type FeaturedProductsProps = {
  limit?: number;
};

export async function FeaturedProducts({ limit = 4 }: FeaturedProductsProps) {
  const products = await getFeaturedCatalogItems(limit);
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-950">Sản phẩm nổi bật</h2>
      <ProductGrid products={products} />
    </section>
  );
}
