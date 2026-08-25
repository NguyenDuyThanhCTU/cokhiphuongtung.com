import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProductBadges } from "@/features/catalog/components/ProductBadges";
import { ProductCta } from "@/features/catalog/components/ProductCta";
import { ProductGallery } from "@/features/catalog/components/ProductGallery";
import { ProductPrice } from "@/features/catalog/components/ProductPrice";
import { VariantSelector } from "@/features/catalog/components/VariantSelector";
import type { CatalogItem } from "@/features/catalog/types";
import { routes } from "@/lib/constants/routes";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";

type ProductDetailProps = {
  product: CatalogItem;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const categories =
    product.categories && product.categories.length > 0
      ? product.categories
      : product.category
        ? [product.category]
        : [];

  return (
    <article className="grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
      <ProductGallery product={product} />
      <div>
        <ProductBadges product={product} />
        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-zinc-950">
          {product.title}
        </h1>
        {product.sku ? (
          <p className="mt-2 text-sm text-zinc-500">SKU: {product.sku}</p>
        ) : null}
        {product.shortDescription ? (
          <p className="mt-4 text-base leading-7 text-zinc-600">
            {product.shortDescription}
          </p>
        ) : null}
        <ProductPrice
          className="mt-5"
          price={product.price}
          finalPrice={product.finalPrice}
          discountPercent={product.discountPercent}
        />
        <div className="mt-6">
          <VariantSelector variants={product.variants} />
        </div>
        <ProductCta slug={product.slug} mode="contact" className="mt-6" />

        {categories.length > 0 ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-zinc-950">Danh mục</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`${routes.products}?category=${category.slug}`}
                >
                  <Badge>{category.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {product.tags && product.tags.length > 0 ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-zinc-950">Tag</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link key={tag.id} href={`${routes.products}?tag=${tag.slug}`}>
                  <Badge>{tag.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {product.description ? (
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-zinc-950">Mô tả</h2>
          <HtmlContent html={product.description} />
        </section>
      ) : null}
    </article>
  );
}
