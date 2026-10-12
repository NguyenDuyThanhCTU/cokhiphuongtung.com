/* Hallmark · pre-emit critique: P4 H4 E5 S5 R5 V4 */
"use client";

import { Grid3X3, List } from "lucide-react";
import { useEffect, useState } from "react";

import type { BlogPost } from "@/features/content/types";
import { BlogCard } from "@/components/home/HomeNews";

type ViewMode = "list" | "grid";

const COMPACT_VIEW_QUERY = "(max-width: 1280px)";

export default function BlogViewSwitcher({ posts }: { posts: BlogPost[] }) {
  const [selectedMode, setSelectedMode] = useState<ViewMode>("list");
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_VIEW_QUERY);
    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const effectiveMode: ViewMode = isCompactViewport ? "grid" : selectedMode;

  if (!posts.length) {
    return <div className="border bg-white p-10 text-center text-sm">Nội dung đang được cập nhật.</div>;
  }

  return (
    <section aria-labelledby="all-posts-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="all-posts-heading" className="text-[22px] font-normal text-mainColorHover">Tất cả bài viết</h2>
          <p className="mt-1 text-sm text-gray-500">{posts.length} bài viết</p>
        </div>

        <div className="inline-flex border border-mainColorHover bg-white p-1" role="group" aria-label="Chọn chế độ hiển thị bài viết">
          <button
            type="button"
            onClick={() => setSelectedMode("list")}
            disabled={isCompactViewport}
            aria-pressed={effectiveMode === "list"}
            className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium transition ${effectiveMode === "list" ? "bg-mainColorHover text-white" : "text-mainColorHover hover:bg-mainColor/25"} disabled:cursor-not-allowed disabled:opacity-45`}
            title={isCompactViewport ? "Chế độ 2 được dùng tự động khi màn hình thu hẹp hoặc phóng to" : "Hiển thị dạng danh sách"}
          >
            <List size={17} aria-hidden="true" /> Chế độ 1
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode("grid")}
            aria-pressed={effectiveMode === "grid"}
            className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium transition ${effectiveMode === "grid" ? "bg-mainColorHover text-white" : "text-mainColorHover hover:bg-mainColor/25"}`}
          >
            <Grid3X3 size={17} aria-hidden="true" /> Chế độ 2
          </button>
        </div>
      </div>

      <div className={effectiveMode === "list" ? "flex flex-col gap-7" : "grid gap-6 sm:grid-cols-2 md:grid-cols-3"}>
        {posts.map((post) => <BlogCard key={post.id} Data={post} variant={effectiveMode} />)}
      </div>
    </section>
  );
}
