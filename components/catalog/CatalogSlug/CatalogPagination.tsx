import Link from "next/link";
import {
  buildCatalogListHref,
  type SearchParamsRecord,
} from "./catalog-list-query";

type CatalogPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CatalogPaginationProps = {
  basePath: string;
  meta?: CatalogPaginationMeta;
  searchParams: SearchParamsRecord;
};

function getPageItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  });

  return items;
}

export function CatalogPagination({
  basePath,
  meta,
  searchParams,
}: CatalogPaginationProps) {
  if (!meta || meta.totalPages <= 1 || meta.total <= meta.limit) {
    return null;
  }

  const currentPage = Math.min(Math.max(meta.page, 1), meta.totalPages);
  const pageItems = getPageItems(currentPage, meta.totalPages);
  const from = (currentPage - 1) * meta.limit + 1;
  const to = Math.min(currentPage * meta.limit, meta.total);

  return (
    <nav
      className="mt-10 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      aria-label="Phân trang dịch vụ"
    >
      <p className="text-sm text-zinc-500">
        Hiển thị <span className="font-semibold text-zinc-900">{from}</span>–
        <span className="font-semibold text-zinc-900">{to}</span> trong tổng số{" "}
        <span className="font-semibold text-zinc-900">{meta.total}</span> kết
        quả
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildCatalogListHref(basePath, searchParams, {
            page: Math.max(currentPage - 1, 1),
          })}
          aria-disabled={currentPage <= 1}
          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
            currentPage <= 1
              ? "pointer-events-none border-zinc-100 bg-zinc-50 text-zinc-300"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          Trước
        </Link>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-zinc-400">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildCatalogListHref(basePath, searchParams, {
                page: item,
              })}
              aria-current={item === currentPage ? "page" : undefined}
              className={`min-w-10 rounded-full border px-3 py-2 text-center text-sm font-semibold transition ${
                item === currentPage
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {item}
            </Link>
          ),
        )}

        <Link
          href={buildCatalogListHref(basePath, searchParams, {
            page: Math.min(currentPage + 1, meta.totalPages),
          })}
          aria-disabled={currentPage >= meta.totalPages}
          className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
            currentPage >= meta.totalPages
              ? "pointer-events-none border-zinc-100 bg-zinc-50 text-zinc-300"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          Sau
        </Link>
      </div>
    </nav>
  );
}
