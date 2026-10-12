import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import BlogViewSwitcher from "@/components/blogs/BlogViewSwitcher";
import { getBlogPosts } from "@/features/content/services/content.service";

export const metadata: Metadata = {
  title: "Tin tức cơ khí và sắt mỹ thuật",
  description: "Chuyên mục bài viết về sản phẩm cơ khí, sắt mỹ thuật, vật liệu và kinh nghiệm thi công.",
  alternates: { canonical: "/chuyen-muc" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogsH1 Content="Tin tức & kinh nghiệm" description="Kiến thức về vật liệu, thiết kế, bảo dưỡng và thi công các hạng mục cơ khí." />
      <div className="min-h-screen">
          <BlogViewSwitcher posts={posts} />
      </div>
    </>
  );
}
