import Link from "next/link";
import type { CatalogTag } from "@/features/catalog/types";
import {
  buildCatalogHref,
  getFirstValue,
  isParamEnabled,
  type CatalogSearchParamsInput,
} from "./catalog-list-query";

type CatalogFiltersProps = {
  tags: CatalogTag[];
  searchParams?: CatalogSearchParamsInput;
};

const sortOptions = [
  { value: "sort_order", label: "Mặc định" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
] as const;

const booleanFilters = [
  { key: "featured", label: "Nổi bật" },
  { key: "bestSeller", label: "Bán chạy" },
  { key: "discounted", label: "Đang giảm giá" },
] as const;

function FilterChip({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        isActive
          ? "inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          : "inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-brand-300 hover:text-brand-700"
      }
    >
      {children}
    </Link>
  );
}

export function CatalogFilters({
  tags,
  searchParams = {},
}: CatalogFiltersProps) {
  const currentQ = getFirstValue(searchParams.q) ?? "";
  const currentTag = getFirstValue(searchParams.tag);
  const currentSort = getFirstValue(searchParams.sort) ?? "sort_order";

  const activeTags = tags.filter((tag) => tag.isActive !== false);

  return (
    <section className="mb-6 space-y-5 rounded-3xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm md:p-6">
      <form
        action="/danh-muc"
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
      >
        {currentTag ? (
          <input type="hidden" name="tag" value={currentTag} />
        ) : null}
        {currentSort !== "sort_order" ? (
          <input type="hidden" name="sort" value={currentSort} />
        ) : null}
        {booleanFilters.map((filter) =>
          isParamEnabled(searchParams[filter.key]) ? (
            <input
              key={filter.key}
              type="hidden"
              name={filter.key}
              value="true"
            />
          ) : null,
        )}

        <input
          name="q"
          defaultValue={currentQ}
          placeholder="Tìm sản phẩm, hạng mục..."
          className="h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="h-12 rounded-2xl bg-brand-400 px-6 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-brand-300"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-zinc-800">Tag</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            href={buildCatalogHref(searchParams, { tag: undefined, page: 1 })}
            isActive={!currentTag}
          >
            Tất cả
          </FilterChip>
          {activeTags.map((tag) => (
            <FilterChip
              key={tag.id}
              href={buildCatalogHref(searchParams, {
                tag: tag.slug,
                page: 1,
              })}
              isActive={currentTag === tag.slug}
            >
              {tag.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-zinc-800">Bộ lọc nhanh</p>
          <div className="flex flex-wrap gap-2">
            {booleanFilters.map((filter) => {
              const isActive = isParamEnabled(searchParams[filter.key]);

              return (
                <FilterChip
                  key={filter.key}
                  href={buildCatalogHref(searchParams, {
                    [filter.key]: isActive ? undefined : true,
                    page: 1,
                  })}
                  isActive={isActive}
                >
                  {filter.label}
                </FilterChip>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 lg:text-right">
          <p className="text-sm font-semibold text-zinc-800">Sắp xếp</p>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {sortOptions.map((option) => (
              <FilterChip
                key={option.value}
                href={buildCatalogHref(searchParams, {
                  sort:
                    option.value === "sort_order" ? undefined : option.value,
                  page: 1,
                })}
                isActive={currentSort === option.value}
              >
                {option.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
