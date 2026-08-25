"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CornerUpLeft, Layers3, Search } from "lucide-react";

import type { CatalogCategory } from "@/features/catalog/types";
import { getCatalogCategoryNavigationContext } from "./catalog-category-tree";

type CatalogChildCategoryNavigatorProps = {
  categories: CatalogCategory[];
  currentCategory: CatalogCategory;
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function CatalogChildCategoryNavigator({
  categories,
  currentCategory,
}: CatalogChildCategoryNavigatorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useMemo(
    () => getCatalogCategoryNavigationContext(categories, currentCategory),
    [categories, currentCategory],
  );
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);
  const filteredItems = useMemo(() => {
    if (!navigation || !normalizedSearchTerm) return navigation?.items ?? [];

    return navigation.items.filter((category) =>
      normalizeSearchValue(
        `${category.name} ${category.description ?? ""}`,
      ).includes(normalizedSearchTerm),
    );
  }, [navigation, normalizedSearchTerm]);

  if (!navigation) return null;

  const isViewingChildCategory = navigation.mode === "siblings";
  const shouldShowSearch = navigation.items.length > 8;

  return (
    <section
      className="mt-8 rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-5 shadow-sm sm:p-7"
      aria-labelledby="catalog-route-navigator-title"
    >
      <div className="flex flex-col gap-5 d:flex-row d:items-end d:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
            <Layers3 size={17} aria-hidden="true" />
            {isViewingChildCategory ? "Đổi nhóm sản phẩm" : "Danh mục sản phẩm"}
          </p>
          <h2
            id="catalog-route-navigator-title"
            className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
          >
            Chọn hạng mục phù hợp
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {isViewingChildCategory
              ? `Bạn đang xem một nhóm thuộc ${navigation.groupCategory.name}. Chọn nhóm khác để đổi danh sách sản phẩm.`
              : `Chọn một nhóm thuộc ${navigation.groupCategory.name} để xem các sản phẩm phù hợp.`}
          </p>
        </div>

        {isViewingChildCategory ? (
          <Link
            href={`/danh-muc/${navigation.groupCategory.slug}`}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-brand-800 transition hover:text-brand-600"
          >
            <CornerUpLeft size={17} aria-hidden="true" />
            Xem nhóm {navigation.groupCategory.name}
          </Link>
        ) : null}
      </div>

      {shouldShowSearch ? (
        <label className="relative mt-6 block max-w-xl">
          <span className="sr-only">Tìm nhanh nhóm sản phẩm</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm nhanh nhóm sản phẩm..."
            className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </label>
      ) : null}

      {filteredItems.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 d:grid-cols-3">
          {filteredItems.map((category) => {
            const isCurrent = category.slug === currentCategory.slug;

            return (
              <Link
                key={category.id}
                href={`/danh-muc/${category.slug}`}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-950 bg-slate-950 p-4 text-white shadow-md"
                    : "group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
                }
              >
                <span
                  className={
                    isCurrent
                      ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-400 text-slate-950"
                      : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800 transition group-hover:bg-brand-400 group-hover:text-slate-950"
                  }
                >
                  <Layers3 size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="line-clamp-2 block text-sm leading-5">
                    {category.name}
                  </strong>
                  <span
                    className={
                      isCurrent
                        ? "mt-1 block text-xs font-semibold text-brand-300"
                        : "mt-1 block text-xs font-semibold text-slate-500"
                    }
                  >
                    {isCurrent ? "Đang xem" : "Xem sản phẩm"}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className={
                    isCurrent
                      ? "shrink-0 text-brand-300"
                      : "shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-700"
                  }
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-900">
            Không tìm thấy nhóm sản phẩm phù hợp
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Hãy thử một từ khóa ngắn hơn hoặc xóa nội dung tìm kiếm.
          </p>
        </div>
      )}
    </section>
  );
}
