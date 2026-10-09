import type { Metadata } from "next";
import Link from "next/link";

import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getServiceGallery, getServicePrimaryImage } from "@/components/catalog/Detail/catalog-service-detail";
import { ProductImageGallery } from "@/components/catalog/ProductImageGallery";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { getCatalogItemBySlug, getCatalogItems } from "@/features/catalog/services/catalog.service";
import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import { getPublicSiteSettings } from "@/features/site/services/site.service";
import { getPhoneHref, getPrimaryHotline } from "@/features/site/utils/contact";

type ProductDetailPageProps = { params: { slug: string } };

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getCatalogItemBySlug(params.slug);
  const image = getServicePrimaryImage(product);
  const description = product.seoDescription ?? product.shortDescription ?? product.title;
  return { title: product.seoTitle ?? product.title, description, alternates: { canonical: `/san-pham/${product.slug}` }, openGraph: { title: product.seoTitle ?? product.title, description, images: image ? [image] : [] } };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getCatalogItemBySlug(params.slug);
  const settings = await getPublicSiteSettings();
  const hotline = getPrimaryHotline(settings);
  const categorySlug = product.category?.slug ?? product.categories?.[0]?.slug;
  const related = categorySlug ? (await getCatalogItems({ category: categorySlug, limit: 4, sort: "sort_order" })).items.filter((item) => item.slug !== product.slug).slice(0, 3) : [];
  const image = getServicePrimaryImage(product);
  const gallery = image
    ? [image, ...getServiceGallery(product).filter((item) => item !== image)]
    : [];

  return (
    <div>
      <div className="grid gap-5 p:grid-cols-1 d:grid-cols-2">
        <ProductImageGallery images={gallery} title={product.title} />
        <div className="flex flex-col gap-3">
          <div><h1 className="text-[18px] uppercase">{product.title}</h1><div className="h-1 w-24 bg-black" /></div>
          <div className="text-[14px] font-normal text-red-500">Giá: {getProductPriceLabel(product, "Liên hệ")}</div>
          {product.shortDescription ? <p className="italic leading-7">{product.shortDescription}</p> : <div className="bg-white p-3 text-[14px]"><div className="grid grid-cols-5 border-b py-1"><strong className="col-span-2 font-normal">Khuyến mãi:</strong><p className="col-span-3 italic">Liên hệ để nhận tư vấn và báo giá theo nhu cầu thực tế.</p></div><div className="grid grid-cols-5 py-1"><span className="col-span-2">Thông số sản phẩm:</span><span className="col-span-3 italic">Đang cập nhật</span></div></div>}
          <a href={getPhoneHref(hotline)} className="rounded-md border bg-orange-500 py-2 text-center text-[18px] font-normal uppercase text-white duration-300 hover:bg-orange-600" data-track="click_hotline_product">hotline: {hotline}</a>
        </div>
      </div>
      <section className="mt-5 rounded-lg border border-gray-300 bg-white p-4">
        <h2 className="text-[22px] font-semibold text-mainColorHover">Mô tả</h2>
        {product.description ? <HtmlContent html={product.description} className="mt-2 font-light" /> : <p className="mt-2">Đang cập nhật</p>}
        {related.length ? <div className="mt-5"><h2 className="mb-2">Sản phẩm liên quan</h2><CatalogGrid items={related} hotline={hotline} /></div> : null}
        <div className="mt-5"><Link href="/bao-gia" className="inline-block bg-mainColorHover px-5 py-2 font-normal text-white hover:bg-mainColor">Yêu cầu báo giá</Link></div>
      </section>
    </div>
  );
}
