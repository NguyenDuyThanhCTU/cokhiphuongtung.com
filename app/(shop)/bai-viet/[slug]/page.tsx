import type { Metadata } from "next";

import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import RelatedPosts from "@/components/blogs/RelatedPosts";
import {
  getBlogPostBySlug,
  getBlogPosts,
} from "@/features/content/services/content.service";

type BlogDetailPageProps = { params: { slug: string } };

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  const image = post.ogImage ?? post.thumbnailUrl ?? undefined;
  const description = post.seoDescription ?? post.excerpt ?? "Bài viết";
  return {
    title: post.seoTitle ?? post.title,
    description,
    alternates: { canonical: `/bai-viet/${post.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [post, posts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogPosts(),
  ]);
  const relatedPosts = post.category
    ? posts
        .filter(
          (candidate) =>
            candidate.slug !== post.slug &&
            (String(candidate.category?.id ?? "") ===
              String(post.category?.id) ||
              candidate.category?.slug === post.category?.slug),
        )
        .slice(0, 3)
    : [];

  return (
    <>
      <article className="">
        <h1 className="text-[20px]  text-mainColorHover text-center text-[40px] font-bold uppercase">
          {post.title}
        </h1>
        <div className="flex justify-center mt-4">
          <div className="h-[2px] bg-black w-36"></div>
        </div>
        {post.content ? (
          <HtmlContent html={post.content} className="mt-4" />
        ) : (
          <p className="mt-4">Chưa có nội dung.</p>
        )}
      </article>
      <RelatedPosts posts={relatedPosts} />
    </>
  );
}
