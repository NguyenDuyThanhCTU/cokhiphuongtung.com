import type { Metadata } from "next";
import { CiClock2 } from "react-icons/ci";

import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { getBlogPostBySlug } from "@/features/content/services/content.service";
import { formatDate } from "@/lib/utils/format-date";

type BlogDetailPageProps = { params: { slug: string } };

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  const image = post.ogImage ?? post.thumbnailUrl ?? undefined;
  const description = post.seoDescription ?? post.excerpt ?? "Bài viết";
  return { title: post.seoTitle ?? post.title, description, alternates: { canonical: `/bai-viet/${post.slug}` }, openGraph: { title: post.seoTitle ?? post.title, description, images: image ? [image] : [] } };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  const date = post.publishedAt ?? post.createdAt;
  return (
    <article className="rounded-lg border border-gray-300 bg-white p-4">
      <h1 className="text-[20px] font-normal text-mainColorHover">{post.title}</h1>
      {date ? <div className="flex items-center gap-2 text-[14px]"><CiClock2 /><p>{formatDate(date)}</p></div> : null}
      {post.content ? <HtmlContent html={post.content} className="mt-4" /> : <p className="mt-4">Chưa có nội dung.</p>}
    </article>
  );
}
