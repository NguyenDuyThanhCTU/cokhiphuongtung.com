import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import BlogCategoryDirectory from "@/components/blogs/BlogCategoryDirectory";
import { BlogCard } from "@/components/home/HomeNews";
import { getBlogPosts, getPostCategories } from "@/features/content/services/content.service";

export const metadata: Metadata = {
  title: "Tin tức cơ khí và sắt mỹ thuật",
  description: "Chuyên mục bài viết về sản phẩm cơ khí, sắt mỹ thuật, vật liệu và kinh nghiệm thi công.",
  alternates: { canonical: "/chuyen-muc" },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getPostCategories()]);

  return (
    <>
      <BlogsH1 Content="Tin tức & kinh nghiệm" description="Kiến thức về vật liệu, thiết kế, bảo dưỡng và thi công các hạng mục cơ khí." />
      <div className="min-h-screen">
          <BlogCategoryDirectory categories={categories} />
          <div className="mb-3 flex items-end justify-between gap-4"><h2 className="text-[22px] font-normal text-mainColorHover">Tất cả bài viết</h2><span className="text-sm">{posts.length} bài viết</span></div>
          {posts.length ? <div className="flex flex-col gap-7">{posts.map((item) => <BlogCard key={item.id} Data={item} />)}</div> : <div className="border bg-white p-10 text-center text-sm">Nội dung đang được cập nhật.</div>}
      </div>
    </>
  );
}
