import Link from "next/link";
import { BlogPostSort, createCategoryHref } from "./blog-category-filter";

export type BlogCategoryPaginationProps = {
  mainCategorySlug: string;
  currentPage: number;
  totalPages: number;
  q: string;
  selectedSubSlugs: string[];
  sort: BlogPostSort;
  limit: number;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return Array.from(pages).sort((a, b) => a - b);
}

export default function BlogCategoryPagination({
  mainCategorySlug,
  currentPage,
  totalPages,
  q,
  selectedSubSlugs,
  sort,
  limit,
}: BlogCategoryPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  const hrefForPage = (page: number) =>
    createCategoryHref(mainCategorySlug, {
      subSlugs: selectedSubSlugs,
      q,
      sort,
      page,
      limit,
    });

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Phân trang bài viết"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          Trước
        </Link>
      ) : null}

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const showGap = previousPage && page - previousPage > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {showGap ? <span className="text-zinc-400">...</span> : null}
            <Link
              href={hrefForPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={[
                "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition",
                page === currentPage
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600",
              ].join(" ")}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          Sau
        </Link>
      ) : null}
    </nav>
  );
}
