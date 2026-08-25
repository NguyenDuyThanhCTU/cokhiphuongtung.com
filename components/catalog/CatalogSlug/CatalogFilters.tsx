import Link from "next/link";
import type { CatalogTag } from "@/features/catalog/types";
import {
  buildCatalogListHref,
  getFirstValue,
  type SearchParamsRecord,
} from "./catalog-list-query";

type CatalogFiltersProps = {
  basePath: string;
  searchParams: SearchParamsRecord;
  tags: CatalogTag[];
};

const SORT_OPTIONS = [
  { label: "Thứ tự mặc định", value: "sort_order" },
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
];

const BOOLEAN_FILTERS = [
  { key: "featured", label: "Nổi bật" },
  { key: "bestSeller", label: "Bán chạy" },
  { key: "discounted", label: "Đang giảm giá" },
] as const;

function isActiveBoolean(value: string | string[] | undefined) {
  return ["true", "1", "yes", "on"].includes(
    String(getFirstValue(value) ?? "").toLowerCase(),
  );
}

export function CatalogFilters({
  basePath,
  searchParams,
  tags,
}: CatalogFiltersProps) {
  const activeTag = getFirstValue(searchParams.tag);
  const activeSort = getFirstValue(searchParams.sort) ?? "sort_order";
  const q = getFirstValue(searchParams.q) ?? "";
  const limit = getFirstValue(searchParams.limit) ?? "12";
  const activeTags = tags.filter((tag) => tag.isActive !== false);

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <form
        action={basePath}
        className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_140px_auto]"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Tìm kiếm dịch vụ..."
          className="h-11 min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        />

        <select
          name="sort"
          defaultValue={activeSort}
          className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          name="limit"
          defaultValue={limit}
          className="h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        >
          <option value="12">12 / trang</option>
          <option value="24">24 / trang</option>
          <option value="36">36 / trang</option>
          <option value="48">48 / trang</option>
        </select>

        {activeTag ? (
          <input type="hidden" name="tag" value={activeTag} />
        ) : null}
        {BOOLEAN_FILTERS.map((filter) =>
          isActiveBoolean(searchParams[filter.key]) ? (
            <input
              key={filter.key}
              type="hidden"
              name={filter.key}
              value="true"
            />
          ) : null,
        )}

        <button
          type="submit"
          className="h-11 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Lọc
        </button>
      </form>

      {activeTags.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={buildCatalogListHref(basePath, searchParams, {
              tag: null,
              page: 1,
            })}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              !activeTag
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            Tất cả tag
          </Link>

          {activeTags.map((tag) => (
            <Link
              key={tag.id}
              href={buildCatalogListHref(basePath, searchParams, {
                tag: activeTag === tag.slug ? null : tag.slug,
                page: 1,
              })}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                activeTag === tag.slug
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {BOOLEAN_FILTERS.map((filter) => {
          const active = isActiveBoolean(searchParams[filter.key]);

          return (
            <Link
              key={filter.key}
              href={buildCatalogListHref(basePath, searchParams, {
                [filter.key]: active ? null : true,
                page: 1,
              })}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
