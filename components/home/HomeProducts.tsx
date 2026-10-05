"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { CatalogCategory, CatalogItem } from "@/features/catalog/types";
import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import {
  buildCatalogCategoryMenuTree,
  type CatalogCategoryMenuNode,
} from "@/features/catalog/utils/category-menu-tree";

export const InterprovincialCard = ({
  Data,
}: {
  Data: CatalogItem;
  Hotline?: string;
}) => (
  <Link
    href={`/san-pham/${Data.slug}`}
    className="group block h-full cursor-pointer"
  >
    <article className="flex h-full min-h-[330px] flex-col border border-[#d8c391] bg-white shadow-[0_8px_24px_rgba(59,40,20,0.08)] transition duration-300 group-hover:-translate-y-1 group-hover:border-mainColorHover group-hover:shadow-[0_16px_32px_rgba(59,40,20,0.16)]">
      <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden bg-[#faf8f2]">
        {Data.thumbnailUrl ? <Image src={Data.thumbnailUrl} alt={Data.title} width={500} height={500} className="h-full w-full object-contain p-2 duration-500 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center text-mainColorHover">Đang cập nhật</div>}
        <span className="absolute left-2 top-2 h-5 w-5 border-l border-t border-mainColorHover/50" />
        <span className="absolute bottom-2 right-2 h-5 w-5 border-b border-r border-mainColorHover/50" />
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 border-t border-[#eadfbe] px-4 py-4 text-center">
        <h3 className="truncate2 font-medium leading-6 text-[#332514] transition group-hover:text-mainColorHover">{Data.title}</h3>
        <div className="mt-auto font-normal text-red-600">{getProductPriceLabel(Data, "Liên hệ")}</div>
      </div>
    </article>
  </Link>
);

function belongsToCategory(item: CatalogItem, category: CatalogCategory) {
  if (item.categoryId === category.id || item.category?.id === category.id || item.category?.slug === category.slug) return true;
  return item.categories?.some((value) => value.id === category.id || value.slug === category.slug) ?? false;
}

function getCategoryBranch(
  category: CatalogCategoryMenuNode,
): CatalogCategoryMenuNode[] {
  return [
    category,
    ...category.children.flatMap((child) => getCategoryBranch(child)),
  ];
}

function belongsToCategoryBranch(
  item: CatalogItem,
  category: CatalogCategoryMenuNode,
) {
  return getCategoryBranch(category).some((branchCategory) =>
    belongsToCategory(item, branchCategory),
  );
}

export default function HomeProducts({
  Data,
  categories = [],
}: {
  Data: CatalogItem[];
  categories?: CatalogCategory[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string>
  >({});
  const categoryRoots = buildCatalogCategoryMenuTree(categories);
  const groups = categoryRoots.length
    ? categoryRoots.map((category) => ({
        category,
        items: Data.filter((item) => belongsToCategoryBranch(item, category)),
      }))
    : [
        {
          category: {
            id: "all",
            name: "Sản phẩm",
            slug: "",
            children: [],
          } as CatalogCategoryMenuNode,
          items: Data,
        },
      ];

  return (
    <section className="bg-[#fffdf8] py-10 d:py-14">
      <header className="mx-auto mb-12 max-w-3xl px-4 text-center">
        <p className="font-UTMFleur text-[38px] leading-none text-mainColorHover">Tinh hoa trong từng đường nét</p>
        <h2 className="mt-3 font-iCielPequena text-[28px] uppercase tracking-[0.08em] text-[#241a10] d:text-[34px]">Danh mục sắt mỹ thuật</h2>
        <div className="mx-auto mt-5 flex max-w-[360px] items-center justify-center gap-3"><span className="h-px flex-1 bg-mainColorHover/40" /><span className="h-3 w-3 rotate-45 border border-mainColorHover bg-mainColor" /><span className="h-px flex-1 bg-mainColorHover/40" /></div>
      </header>

      <div className="space-y-16 px-2 d:px-5">
        {groups.map(({ category, items }, groupIndex) => {
          const groupId = String(category.id || category.slug || groupIndex);
          const selectedCategoryId = selectedCategories[groupId] ?? "all";
          const selectedCategory = category.children.find(
            (child) => String(child.id) === selectedCategoryId,
          );
          const visibleItems = selectedCategory
            ? items.filter((item) =>
                belongsToCategoryBranch(item, selectedCategory),
              )
            : items;

          return (
            <section
              key={groupId}
              aria-labelledby={`home-category-${category.slug || groupIndex}`}
            >
            <div className="mb-7 flex flex-col items-center text-center">
              <span className="font-UTMFleur text-[30px] leading-none text-mainColorHover/80">Bộ sưu tập</span>
              <Link href={category.slug ? `/danh-muc/${category.slug}` : "/danh-muc"} className="mt-1 transition hover:text-mainColorHover">
                <h3 id={`home-category-${category.slug || groupIndex}`} className="font-UTMAmericanSans text-[27px] uppercase tracking-[0.06em] text-[#332514] d:text-[34px]">{category.name}</h3>
              </Link>
              <div className="mt-3 flex w-full max-w-[520px] items-center gap-3"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-mainColorHover/60" /><span className="h-2.5 w-2.5 rotate-45 bg-mainColorHover" /><span className="h-px flex-1 bg-gradient-to-l from-transparent to-mainColorHover/60" /></div>
              {category.description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">{category.description}</p> : null}
              <div
                className="mt-5 flex w-full max-w-full gap-2 overflow-x-auto pb-2 p:justify-start d:flex-wrap d:justify-center"
                role="group"
                aria-label={`Lọc sản phẩm ${category.name}`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategories((current) => ({
                      ...current,
                      [groupId]: "all",
                    }))
                  }
                  aria-pressed={selectedCategoryId === "all"}
                  className={`shrink-0 whitespace-nowrap border px-4 py-2 text-sm font-medium duration-200 ${selectedCategoryId === "all" ? "border-mainColorHover bg-mainColorHover text-white" : "border-mainColorHover/45 bg-white text-[#332514] hover:border-mainColorHover hover:text-mainColorHover"}`}
                >
                  Tất cả
                </button>
                {category.children.map((child) => {
                  const childId = String(child.id);
                  const isSelected = selectedCategoryId === childId;
                  return (
                    <button
                      key={childId}
                      type="button"
                      onClick={() =>
                        setSelectedCategories((current) => ({
                          ...current,
                          [groupId]: childId,
                        }))
                      }
                      aria-pressed={isSelected}
                      className={`shrink-0 whitespace-nowrap border px-4 py-2 text-sm font-medium duration-200 ${isSelected ? "border-mainColorHover bg-mainColorHover text-white" : "border-mainColorHover/45 bg-white text-[#332514] hover:border-mainColorHover hover:text-mainColorHover"}`}
                    >
                      {child.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleItems.length ? (
              <div className="grid w-full gap-4 p:grid-cols-2 d:grid-cols-5">
                {visibleItems.map((item) => <InterprovincialCard key={item.id || item.slug} Data={item} />)}
              </div>
            ) : (
              <div className="border border-dashed border-mainColorHover/35 bg-white px-5 py-8 text-center text-sm text-stone-500">Sản phẩm thuộc {selectedCategory?.name || category.name} đang được cập nhật.</div>
            )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
