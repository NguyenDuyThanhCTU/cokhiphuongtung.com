"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";

import { BlogCard } from "@/components/home/HomeNews";
import type { BlogPost } from "@/features/content/types";

type ViewMode = "list" | "grid";

const COMPACT_VIEW_QUERY = "(max-width: 1280px)";
const PAGE_SIZE: Record<ViewMode, number> = {
  list: 5,
  grid: 9,
};

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function BlogViewSwitcher({
  posts,
  gridOnly = false,
}: {
  posts: BlogPost[];
  gridOnly?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_VIEW_QUERY);
    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const requestedMode: ViewMode =
    searchParams.get("view") === "grid" ? "grid" : "list";
  const effectiveMode: ViewMode =
    gridOnly || isCompactViewport ? "grid" : requestedMode;
  const pageSize = PAGE_SIZE[effectiveMode];
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const requestedPage = parsePage(searchParams.get("page"));
  const currentPage = Math.min(requestedPage, totalPages);
  const visiblePosts = useMemo(
    () => posts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, posts],
  );

  function updateQuery(mode: ViewMode, page = 1) {
    const params = new URLSearchParams(searchParams.toString());

    if (gridOnly) params.delete("view");
    else params.set("view", mode);

    if (page > 1) params.set("page", String(page));
    else params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  if (!posts.length) {
    return (
      <div className="border bg-white p-10 text-center text-sm">
        Nội dung đang được cập nhật.
      </div>
    );
  }

  const postHref = (post: BlogPost) => `/bai-viet/${post.slug}`;

  return (
    <section aria-label="Danh sách bài viết">
      <div className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="mt-1 text-sm text-gray-500">{posts.length} bài viết</p>

          {!gridOnly ? (
            <div
              className="inline-flex border border-mainColorHover bg-white p-1"
              role="group"
              aria-label="Chọn chế độ hiển thị bài viết"
            >
              <button
                type="button"
                onClick={() => updateQuery("list")}
                disabled={isCompactViewport}
                aria-label="Hiển thị dạng danh sách"
                aria-pressed={effectiveMode === "list"}
                className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColorHover active:bg-mainColor ${effectiveMode === "list" ? "bg-mainColorHover text-white" : "text-mainColorHover hover:bg-mainColor/25"} disabled:cursor-not-allowed disabled:opacity-45`}
                title={
                  isCompactViewport
                    ? "Chế độ lưới được dùng tự động khi màn hình thu hẹp hoặc phóng to"
                    : "Hiển thị dạng danh sách"
                }
              >
                <BsListUl size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => updateQuery("grid")}
                aria-label="Hiển thị dạng lưới"
                aria-pressed={effectiveMode === "grid"}
                className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColorHover active:bg-mainColor ${effectiveMode === "grid" ? "bg-mainColorHover text-white" : "text-mainColorHover hover:bg-mainColor/25"}`}
                title="Hiển thị dạng lưới"
              >
                <BsGrid3X3Gap size={17} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={
          effectiveMode === "list"
            ? "flex flex-col gap-7"
            : "grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        }
      >
        {visiblePosts.map((post) => (
          <BlogCard
            key={post.id}
            Data={post}
            variant={effectiveMode}
            href={postHref(post)}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-9 flex flex-wrap justify-center gap-2"
          aria-label="Phân trang bài viết"
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => updateQuery(effectiveMode, page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Trang ${page}`}
                className={`flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mainColorHover active:bg-mainColor disabled:cursor-not-allowed disabled:opacity-45 ${page === currentPage ? "border-mainColorHover bg-mainColorHover text-white" : "border-mainColorHover/40 bg-white text-mainColorHover hover:border-mainColorHover hover:bg-mainColor/25"}`}
              >
                {page}
              </button>
            ),
          )}
        </nav>
      ) : null}
    </section>
  );
}
