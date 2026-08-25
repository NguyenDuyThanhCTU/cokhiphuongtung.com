import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import BlogCategoryDirectory from "@/components/blogs/BlogCategoryDirectory";
import { BlogCard } from "@/components/home/HomeNews";
import { getBlogPosts, getPostCategories } from "@/features/content/services/content.service";

export const metadata: Metadata = {
  title: "Cẩm nang xe khách và du lịch Hà Giang",
  description: "Chuyên mục bài viết về tuyến xe, vé xe và kinh nghiệm hữu ích cho hành trình Hà Giang.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getPostCategories()]);

  return (
    <>
      <BlogsH1 Content="Cẩm nang Hà Giang" description="Thông tin tuyến xe, vé xe và kinh nghiệm hữu ích cho hành trình của bạn." />
      <div className="min-h-screen bg-bgcontent py-12">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
          <BlogCategoryDirectory categories={categories} />
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">Bài viết mới</p><h2 className="mt-2 text-2xl font-black text-slate-950">Tất cả bài viết</h2></div><span className="text-sm font-semibold text-slate-500">{posts.length} bài viết</span></div>
          {posts.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 d:grid-cols-3">{posts.map((item) => <BlogCard key={item.id} Data={item} />)}</div> : <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">Nội dung đang được cập nhật.</div>}
        </div>
      </div>
    </>
  );
}
