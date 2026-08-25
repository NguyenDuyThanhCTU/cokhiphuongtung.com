import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { getBestSellerCatalogItems } from "@/features/catalog/services/catalog.service";

type BestSellerProductsProps = {
  limit?: number;
};

export async function BestSellerProducts({ limit = 4 }: BestSellerProductsProps) {
  const products = await getBestSellerCatalogItems(limit);
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-950">Sản phẩm bán chạy</h2>
      <ProductGrid products={products} />
    </section>
  );
}
