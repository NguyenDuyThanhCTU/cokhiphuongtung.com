import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

import {
  findCatalogCategoryBySlug,
  getDirectVisibleCatalogChildren,
  isCatalogCategoryVisible,
} from "@/components/catalog/CatalogSlug/catalog-category-tree";
import { getCatalogItems } from "@/features/catalog/services/catalog.service";
import type { CatalogCategory, CatalogItem } from "@/features/catalog/types";
import type { PublicSiteSettings } from "@/features/site/types";
import { getPrimaryHotline } from "@/features/site/utils/contact";
import { InterprovincialCard } from "./HomeProducts";

const ROUTE_CATEGORY_SLUG = "cac-tuyen-xe";
const CATALOG_BATCH_SIZE = 60;

type RouteCategoryGroup = {
  category: CatalogCategory;
  items: CatalogItem[];
};

async function getAllCategoryItems(categorySlug: string) {
  const firstPage = await getCatalogItems({
    category: categorySlug,
    page: 1,
    limit: CATALOG_BATCH_SIZE,
    sort: "sort_order",
  });
  const totalPages = Math.max(firstPage.meta?.totalPages ?? 1, 1);

  const remainingPages =
    totalPages > 1
      ? await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            getCatalogItems({
              category: categorySlug,
              page: index + 2,
              limit: CATALOG_BATCH_SIZE,
              sort: "sort_order",
            }),
          ),
        )
      : [];

  const uniqueItems = new Map<string, CatalogItem>();

  [firstPage, ...remainingPages].forEach((page) => {
    page.items.forEach((item) => {
      uniqueItems.set(item.id || item.slug, item);
    });
  });

  return Array.from(uniqueItems.values());
}

async function getRouteCategoryGroups(categories: CatalogCategory[]) {
  const parentCategory = findCatalogCategoryBySlug(
    categories,
    ROUTE_CATEGORY_SLUG,
  );

  if (!isCatalogCategoryVisible(parentCategory)) return [];

  const childCategories = getDirectVisibleCatalogChildren(
    categories,
    parentCategory,
  );
  const itemGroups = await Promise.all(
    childCategories.map((category) => getAllCategoryItems(category.slug)),
  );

  return childCategories.reduce<RouteCategoryGroup[]>(
    (groups, category, index) => {
      const items = itemGroups[index];

      if (items.length > 0) {
        groups.push({ category, items });
      }

      return groups;
    },
    [],
  );
}

type HomeRouteCategoriesProps = {
  categories: CatalogCategory[];
  settings: PublicSiteSettings;
};

export default async function HomeRouteCategories({
  categories,
  settings,
}: HomeRouteCategoriesProps) {
  const groups = await getRouteCategoryGroups(categories);

  if (groups.length === 0) return null;

  const hotline = getPrimaryHotline(settings);

  return (
    <section
      className="bg-white py-14 d:py-20"
      aria-labelledby="home-routes-title"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
              Danh sách tuyến xe
            </p>
            <h2
              id="home-routes-title"
              className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
            >
              Khám phá các tuyến xe từ Hà Giang
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Chọn nhóm tuyến phù hợp để xem thông tin, tham khảo giá vé và gửi
              yêu cầu đặt vé nhanh.
            </p>
          </div>
          <Link
            href={`/danh-muc/${ROUTE_CATEGORY_SLUG}`}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-700 transition hover:text-brand-500"
          >
            Xem tất cả tuyến xe
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <nav
          className="mt-8 flex gap-2 overflow-x-auto pb-2"
          aria-label="Đi đến nhóm tuyến xe"
        >
          {groups.map(({ category, items }) => (
            <a
              key={category.id || category.slug}
              href={`#tuyen-xe-${category.slug}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              {category.name}
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 shadow-sm">
                {items.length}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-14">
          {groups.map(({ category, items }) => (
            <section
              key={category.id || category.slug}
              id={`tuyen-xe-${category.slug}`}
              className="scroll-mt-24 [content-visibility:auto] [contain-intrinsic-size:800px]"
              aria-labelledby={`tuyen-xe-title-${category.slug}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-400 text-slate-950">
                    <MapPinned size={21} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3
                      id={`tuyen-xe-title-${category.slug}`}
                      className="text-2xl font-black tracking-tight text-slate-950"
                    >
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {items.length} tuyến xe đang phục vụ
                    </p>
                  </div>
                </div>
                <Link
                  href={`/danh-muc/${category.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-700 transition hover:text-brand-500"
                >
                  Xem danh mục
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 d:grid-cols-3">
                {items.map((item) => (
                  <InterprovincialCard
                    key={item.id || item.slug}
                    Data={item}
                    Hotline={hotline}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
