import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import { BlogCard } from "@/components/home/HomeNews";
import { getBlogPosts } from "@/features/content/services/content.service";
import { getPostsInGroup } from "@/features/content/utils/post-groups";

export const metadata: Metadata = { title: "Dự án đã triển khai", description: "Tham khảo các công trình cơ khí và sắt mỹ thuật do Cơ Khí Phương Tùng triển khai.", alternates: { canonical: "/du-an" } };

export default async function ProjectsPage() {
  const projects = getPostsInGroup(await getBlogPosts(), "du-an");
  return <><BlogsH1 Content="Dự Án" />{projects.length ? <div className="flex flex-col gap-7">{projects.map((project) => <BlogCard key={project.id} Data={project} />)}</div> : <div className="border bg-white p-10 text-center">Dự án đang được cập nhật</div>}</>;
}
