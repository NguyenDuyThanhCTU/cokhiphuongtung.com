import Link from "next/link";
import type { CatalogTag } from "@/features/catalog/types";
import {
  buildCatalogHref,
  getFirstValue,
  isParamEnabled,
  type CatalogSearchParamsInput,
} from "./catalog-list-query";

type CatalogActiveFiltersProps = {
  tags: CatalogTag[];
  searchParams?: CatalogSearchParamsInput;
};

const booleanFilterLabels = {
  featured: "Nổi bật",
  bestSeller: "Bán chạy",
  discounted: "Đang giảm giá",
} as const;

const sortLabels: Record<string, string> = {
  newest: "Mới nhất",
  price_asc: "Giá tăng dần",
  price_desc: "Giá giảm dần",
  sort_order: "Mặc định",
};

function ActiveFilterChip({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
    >
      <span>{children}</span>
      <span aria-hidden="true">×</span>
    </Link>
  );
}

export function CatalogActiveFilters({
  tags,
  searchParams = {},
}: CatalogActiveFiltersProps) {
  const q = getFirstValue(searchParams.q);
  const tag = getFirstValue(searchParams.tag);
  const sort = getFirstValue(searchParams.sort);
  const selectedTag = tags.find((item) => item.slug === tag);

  const hasBooleanFilter = Object.keys(booleanFilterLabels).some((key) =>
    isParamEnabled(searchParams[key]),
  );

  const hasActiveFilter = Boolean(q || tag || sort || hasBooleanFilter);

  if (!hasActiveFilter) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-zinc-700">
      <span className="text-sm font-semibold text-zinc-500">Đang lọc:</span>

      {q ? (
        <ActiveFilterChip
          href={buildCatalogHref(searchParams, { q: undefined, page: 1 })}
        >
          Từ khóa: {q}
        </ActiveFilterChip>
      ) : null}

      {tag ? (
        <ActiveFilterChip
          href={buildCatalogHref(searchParams, { tag: undefined, page: 1 })}
        >
          Tag: {selectedTag?.name ?? tag}
        </ActiveFilterChip>
      ) : null}

      {(
        Object.keys(booleanFilterLabels) as Array<
          keyof typeof booleanFilterLabels
        >
      ).map((key) =>
        isParamEnabled(searchParams[key]) ? (
          <ActiveFilterChip
            key={key}
            href={buildCatalogHref(searchParams, { [key]: undefined, page: 1 })}
          >
            {booleanFilterLabels[key]}
          </ActiveFilterChip>
        ) : null,
      )}

      {sort ? (
        <ActiveFilterChip
          href={buildCatalogHref(searchParams, { sort: undefined, page: 1 })}
        >
          Sắp xếp: {sortLabels[sort] ?? sort}
        </ActiveFilterChip>
      ) : null}

      <Link
        href="/danh-muc"
        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
      >
        Xóa tất cả
      </Link>
    </div>
  );
}
