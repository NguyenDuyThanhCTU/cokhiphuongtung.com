import Link from "next/link";
import type { CatalogTag } from "@/features/catalog/types";
import {
  buildCatalogListHref,
  getFirstValue,
  hasActiveCatalogFilters,
  type SearchParamsRecord,
} from "./catalog-list-query";

type CatalogActiveFiltersProps = {
  basePath: string;
  searchParams: SearchParamsRecord;
  tags: CatalogTag[];
};

const FILTER_LABELS = {
  featured: "Nổi bật",
  bestSeller: "Bán chạy",
  discounted: "Đang giảm giá",
} as const;

const SORT_LABELS: Record<string, string> = {
  newest: "Mới nhất",
  price_asc: "Giá tăng dần",
  price_desc: "Giá giảm dần",
  sort_order: "Thứ tự mặc định",
};

function isActiveBoolean(value: string | string[] | undefined) {
  return ["true", "1", "yes", "on"].includes(
    String(getFirstValue(value) ?? "").toLowerCase(),
  );
}

export function CatalogActiveFilters({
  basePath,
  searchParams,
  tags,
}: CatalogActiveFiltersProps) {
  if (!hasActiveCatalogFilters(searchParams)) {
    return null;
  }

  const activeTagSlug = getFirstValue(searchParams.tag);
  const activeTag = tags.find((tag) => tag.slug === activeTagSlug);
  const q = getFirstValue(searchParams.q);
  const sort = getFirstValue(searchParams.sort);

  const chips: Array<{ key: string; label: string; removeKey: string }> = [];

  if (q) chips.push({ key: "q", label: `Từ khóa: ${q}`, removeKey: "q" });
  if (activeTagSlug) {
    chips.push({
      key: "tag",
      label: `Tag: ${activeTag?.name ?? activeTagSlug}`,
      removeKey: "tag",
    });
  }
  if (sort) {
    chips.push({
      key: "sort",
      label: `Sắp xếp: ${SORT_LABELS[sort] ?? sort}`,
      removeKey: "sort",
    });
  }

  Object.entries(FILTER_LABELS).forEach(([key, label]) => {
    if (isActiveBoolean(searchParams[key])) {
      chips.push({ key, label, removeKey: key });
    }
  });

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-500">Đang lọc:</span>

      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildCatalogListHref(basePath, searchParams, {
            [chip.removeKey]: null,
            page: 1,
          })}
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </Link>
      ))}

      <Link
        href={basePath}
        className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
      >
        Xóa tất cả
      </Link>
    </div>
  );
}
