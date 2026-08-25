import Link from "next/link";
import {
  buildCatalogHref,
  type CatalogSearchParamsInput,
} from "./catalog-list-query";
import type { CatalogListResult } from "@/features/catalog/types";

type CatalogPaginationProps = {
  meta?: CatalogListResult["meta"];
  searchParams?: CatalogSearchParamsInput;
  pathname?: string;
};

type PageToken = number | "ellipsis";

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

function getPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const tokens: PageToken[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      tokens.push("ellipsis");
    }

    tokens.push(page);
  });

  return tokens;
}

function PaginationButton({
  children,
  href,
  isActive,
  isDisabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  ariaLabel?: string;
}) {
  const baseClassName =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition";

  if (isDisabled || !href) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClassName} cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      className={
        isActive
          ? `${baseClassName} border-orange-600 bg-orange-600 text-white shadow-sm`
          : `${baseClassName} border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600`
      }
    >
      {children}
    </Link>
  );
}

export function CatalogPagination({
  meta,
  searchParams = {},
  pathname = "/danh-muc",
}: CatalogPaginationProps) {
  if (!meta || meta.totalPages <= 1 || meta.total <= meta.limit) {
    return null;
  }

  const totalPages = Math.max(meta.totalPages, 1);
  const currentPage = clampPage(meta.page, totalPages);
  const pageTokens = getPageTokens(currentPage, totalPages);
  const firstItemIndex = (currentPage - 1) * meta.limit + 1;
  const lastItemIndex = Math.min(currentPage * meta.limit, meta.total);

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-700 shadow-sm md:flex-row"
      aria-label="Phân trang danh sách dịch vụ"
    >
      <p className="text-sm text-zinc-500">
        Hiển thị{" "}
        <span className="font-semibold text-zinc-900">{firstItemIndex}</span>
        {" - "}
        <span className="font-semibold text-zinc-900">{lastItemIndex}</span>
        {" / "}
        <span className="font-semibold text-zinc-900">{meta.total}</span> dịch
        vụ
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <PaginationButton
          href={
            currentPage > 1
              ? buildCatalogHref(
                  searchParams,
                  { page: currentPage - 1 },
                  pathname,
                )
              : undefined
          }
          isDisabled={currentPage <= 1}
          ariaLabel="Trang trước"
        >
          Trước
        </PaginationButton>

        {pageTokens.map((token, index) => {
          if (token === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-10 min-w-10 items-center justify-center px-2 text-sm font-semibold text-zinc-400"
              >
                ...
              </span>
            );
          }

          return (
            <PaginationButton
              key={token}
              href={buildCatalogHref(searchParams, { page: token }, pathname)}
              isActive={token === currentPage}
              ariaLabel={`Trang ${token}`}
            >
              {token}
            </PaginationButton>
          );
        })}

        <PaginationButton
          href={
            currentPage < totalPages
              ? buildCatalogHref(
                  searchParams,
                  { page: currentPage + 1 },
                  pathname,
                )
              : undefined
          }
          isDisabled={currentPage >= totalPages}
          ariaLabel="Trang sau"
        >
          Sau
        </PaginationButton>
      </div>
    </nav>
  );
}
