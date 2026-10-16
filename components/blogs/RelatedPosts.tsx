import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { ClickableContainer } from "@/components/ui/ClickableContainer";
import type { BlogPost } from "@/features/content/types";
import { getPostPreviewText } from "@/features/content/utils/post-preview-text";
import { formatDate } from "@/lib/utils/format-date";

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;

  return (
    <section
      className="mt-12 border-t border-mainColorHover/30 pt-8"
      aria-labelledby="related-posts-title"
    >
      <div className="mb-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-mainColorHover/25" aria-hidden="true" />
        <h2
          id="related-posts-title"
          className="text-center text-2xl font-bold uppercase text-mainColorHover"
        >
          Những bài viết liên quan
        </h2>
        <span className="h-px flex-1 bg-mainColorHover/25" aria-hidden="true" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => {
          const href = `/bai-viet/${post.slug}`;
          const date = post.publishedAt ?? post.createdAt;
          const previewText = getPostPreviewText(post, "excerpt");

          return (
            <ClickableContainer
              as="article"
              key={post.id}
              href={href}
              aria-label={`Xem bài viết ${post.title}`}
              className="group flex h-full cursor-pointer flex-col overflow-hidden border border-[#dfd2b5] bg-white shadow-[0_8px_24px_rgba(59,40,20,.07)] transition hover:-translate-y-1 hover:border-mainColorHover hover:shadow-[0_12px_30px_rgba(59,40,20,.14)]"
            >
              <Link
                href={href}
                className="relative block aspect-[3/2] overflow-hidden bg-stone-100"
              >
                {post.thumbnailUrl ? (
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 20vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-UTMFleur text-3xl text-mainColorHover">
                    Phương Tùng
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-4">
                {date ? (
                  <p className="flex items-center gap-2 text-xs text-stone-500">
                    <CalendarDays
                      size={14}
                      className="text-mainColorHover"
                      aria-hidden="true"
                    />
                    {formatDate(date)}
                  </p>
                ) : null}
                <h3 className="mt-3 line-clamp-2 text-lg font-bold uppercase leading-7 text-[#332514]">
                  <Link
                    href={href}
                    className="transition hover:text-mainColorHover"
                  >
                    {post.title}
                  </Link>
                </h3>
                {previewText ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                    {previewText}
                  </p>
                ) : null}
                <Link
                  href={href}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-mainColorHover"
                >
                  Đọc tiếp <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </ClickableContainer>
          );
        })}
      </div>
    </section>
  );
}
