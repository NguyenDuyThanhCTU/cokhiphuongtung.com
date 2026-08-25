import Image from "next/image";
import Link from "next/link";

import type { CatalogCategory, CatalogItem } from "@/features/catalog/types";
import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import type { PublicSiteSettings } from "@/features/site/types";

export const InterprovincialCard = ({ Data }: { Data: CatalogItem; Hotline?: string }) => (
  <Link href={`/san-pham/${Data.slug}`} className="block cursor-pointer">
    <article className="flex h-[330px] flex-col justify-between border bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-[220px] w-full items-center justify-center overflow-hidden">
          {Data.thumbnailUrl ? <Image src={Data.thumbnailUrl} alt={Data.title} width={500} height={500} className="h-full w-full object-contain px-2 duration-300 hover:scale-110" /> : <div className="flex h-full w-full items-center justify-center bg-gray-100 text-mainColorHover">Đang cập nhật</div>}
        </div>
        <h3 className="truncate2 px-4 text-center font-semibold">{Data.title}</h3>
        <div className="flex items-end gap-2 font-normal text-red-500">{getProductPriceLabel(Data, "Liên hệ")}</div>
      </div>
    </article>
  </Link>
);

function belongsToCategory(item: CatalogItem, category: CatalogCategory) {
  if (item.categoryId === category.id || item.category?.id === category.id || item.category?.slug === category.slug) return true;
  return item.categories?.some((value) => value.id === category.id || value.slug === category.slug) ?? false;
}

export default function HomeProducts({ Data, categories = [] }: { title?: string; Data: CatalogItem[]; settings?: PublicSiteSettings; categories?: CatalogCategory[] }) {
  const visible = categories.filter((category) => category.isActive !== false);
  const groups = visible.map((category) => ({ category, items: Data.filter((item) => belongsToCategory(item, category)).slice(0, 5) })).filter((group) => group.items.length);
  const renderedGroups = groups.length ? groups : [{ category: { id: "all", name: "Sản phẩm", slug: "" } as CatalogCategory, items: Data.slice(0, 5) }];

  return (
    <div className="flex flex-col gap-4">
      {renderedGroups.map(({ category, items }) => (
        <section key={category.id}>
          <div className="flex justify-center border-b border-mainColorHover">
            <h2 className="w-max rounded-t-lg bg-mainColorHover px-4 py-2 text-[20px] font-normal uppercase text-white">{category.name}</h2>
          </div>
          <div className="mt-3 grid w-full gap-5 p:grid-cols-2 d:grid-cols-5">
            {items.map((item) => (
              <Link key={item.id} href={`/san-pham/${item.slug}`} className="flex cursor-pointer flex-col items-center gap-2 duration-300 hover:bg-slate-100">
                <div className="p:h-[150px] p:w-[150px] d:h-[200px] d:w-[200px]">
                  {item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt={item.title} width={400} height={400} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gray-200 text-xs">Đang cập nhật</div>}
                </div>
                <div className="truncate1 text-center text-[14px] font-light hover:text-mainColorHover">{item.title}</div>
                <div className="text-center font-normal text-red-500">{getProductPriceLabel(item, "Liên hệ")}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
