import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { getBlogPostBySlug } from "@/features/content/services/content.service";

import { formatDate } from "@/lib/utils/format-date";
import { buildArticleHtmlWithToc } from "@/components/blogs/Detail/ArticleToc/article-toc";
import { ArticleToc } from "@/components/blogs/Detail/article-toc";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";

type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

async function loadPost(slug: string) {
  try {
    return await getBlogPostBySlug(slug);
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to load blog post.", error);
    }

    notFound();
  }
}

function getCategoryLabel(category: unknown) {
  if (!category) return null;

  if (typeof category === "string") {
    return category;
  }

  if (typeof category === "object") {
    const record = category as Record<string, unknown>;
    const value =
      record.name ?? record.title ?? record.label ?? record.slug ?? null;

    return typeof value === "string" && value.trim() ? value : null;
  }

  return null;
}

function getStatusLabel(status?: string | null) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  if (normalized.includes("publish")) return "Đã xuất bản";
  if (normalized.includes("draft")) return "Bản nháp";
  if (normalized.includes("schedule")) return "Đã lên lịch";
  if (normalized.includes("private")) return "Riêng tư";

  return status;
}

function shouldShowStatusBadge(status?: string | null) {
  if (!status) return false;

  const normalized = status.toLowerCase();

  return !normalized.includes("publish");
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const post = await loadPost(params.slug);

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? "Bài viết",
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images:
        (post.ogImage ?? post.thumbnailUrl)
          ? [post.ogImage ?? post.thumbnailUrl ?? ""]
          : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await loadPost(params.slug);

  const article = post.content
    ? buildArticleHtmlWithToc(post.content, {
        levels: [2, 3, 4],
        idPrefix: "noi-dung",
        preserveExistingIds: true,
      })
    : null;

  const categoryLabel = getCategoryLabel(post.category);
  const displayDate = post.publishedAt ?? post.createdAt ?? null;
  const displayDateLabel = post.publishedAt ? "Ngày đăng" : "Ngày tạo";
  const description = post.excerpt ?? post.seoDescription ?? null;
  const coverImage = post.thumbnailUrl ?? post.ogImage ?? null;
  const statusLabel = getStatusLabel(post.status);
  const permalink = `/bai-viet/${post.slug}`;

  return (
    <div
      id={`post-${post.id}`}
      data-post-slug={post.slug}
      data-post-status={post.status ?? undefined}
      className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 d:px-0 d:py-12"
    >
      <section
        className="overflow-hidden rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
        aria-label={post.seoTitle ?? post.title}
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel ? (
                <span className="inline-flex items-center rounded-full bg-brand-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-slate-950">
                  {categoryLabel}
                </span>
              ) : null}

              {displayDate ? (
                <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                  {displayDateLabel}: {formatDate(displayDate)}
                </span>
              ) : null}

              {shouldShowStatusBadge(post.status) && statusLabel ? (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  {statusLabel}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {coverImage ? (
            <div className="relative min-h-[260px] overflow-hidden bg-zinc-100 lg:min-h-full">
              <Image
                src={coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1023px) 100vw, 460px"
                className="object-cover transition duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
            </div>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center bg-gradient-to-br from-brand-100 to-zinc-100 px-8 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
                  Cẩm nang Hà Giang
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {article ? (
        <div className="article-layout-with-toc mt-8">
          <main className="article-layout-with-toc__content">
            <HtmlContent html={article.html} className="article-content" />
          </main>

          <aside className="article-layout-with-toc__sidebar">
            <ArticleToc items={article.toc} />
          </aside>
        </div>
      ) : (
        <p className="mt-8 text-sm text-zinc-600">Chưa có nội dung.</p>
      )}
    </div>
  );
}
