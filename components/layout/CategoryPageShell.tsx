"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillYoutube } from "react-icons/ai";

import type { CatalogCategory } from "@/features/catalog/types";
import type { BlogPost } from "@/features/content/types";
import { getPostsInGroup } from "@/features/content/utils/post-groups";

function SidebarPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border border-mainColorHover bg-white"><h2 className="bg-mainColorHover py-2 text-center font-semibold uppercase text-white">{title}</h2>{children}</section>;
}

function PostImage({ post }: { post: BlogPost }) {
  return post.thumbnailUrl ? <Image src={post.thumbnailUrl} alt={post.title} width={300} height={200} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200" />;
}

function CategorySidebar({ categories, posts }: { categories: CatalogCategory[]; posts: BlogPost[] }) {
  const roots = categories.filter((category) => category.isActive !== false && !category.parentId);
  const videos = getPostsInGroup(posts, "video").slice(0, 3);
  const projects = getPostsInGroup(posts, "du-an").slice(0, 3);
  const news = posts.filter((post) => !videos.some((item) => item.id === post.id) && !projects.some((item) => item.id === post.id)).slice(0, 5);

  return (
    <aside className="flex flex-col gap-3">
      <SidebarPanel title="Danh mục sản phẩm">
        <nav>{roots.map((category) => <Link key={category.id} href={`/danh-muc/${category.slug}`} className="flex items-center justify-between border-b border-mainColorHover px-4 py-2 text-[15px] font-semibold text-mainColorHover duration-300 hover:bg-mainColor">{category.name}</Link>)}</nav>
      </SidebarPanel>
      {videos.length ? <SidebarPanel title="Video mới nhất"><div className="flex flex-col gap-2">{videos.map((post) => <Link key={post.id} href={`/bai-viet/${post.slug}`} className="p-2"><div className="relative h-[150px] w-full"><PostImage post={post} /><span className="absolute inset-0 flex items-center justify-center text-[50px] text-red-500"><span className="rounded-full border bg-white p-2"><AiFillYoutube /></span></span></div><h3 className="mt-2 text-center text-[14px] font-semibold uppercase leading-[22px] hover:text-mainColorHover">{post.title}</h3></Link>)}</div></SidebarPanel> : null}
      {projects.length ? <SidebarPanel title="Dự án triển khai"><div className="flex flex-col gap-2">{projects.map((post) => <Link key={post.id} href={`/du-an/${post.slug}`} className="p-2"><div className="h-[150px] w-full"><PostImage post={post} /></div><h3 className="mt-2 text-center text-[14px] font-semibold leading-[22px] hover:text-mainColorHover">{post.title}</h3></Link>)}</div></SidebarPanel> : null}
      {news.length ? <SidebarPanel title="Tin tức"><div className="flex flex-col gap-2">{news.map((post) => <Link key={post.id} href={`/bai-viet/${post.slug}`} className="grid grid-cols-5 items-center gap-2 border-b p-2"><div className="col-span-2 h-[100px]"><PostImage post={post} /></div><h3 className="col-span-3 text-[14px] font-light leading-[18px] hover:text-mainColorHover">{post.title}</h3></Link>)}</div></SidebarPanel> : null}
    </aside>
  );
}

export default function CategoryPageShell({ children, categories, posts }: { children: React.ReactNode; categories: CatalogCategory[]; posts: BlogPost[] }) {
  const pathname = usePathname();
  if (pathname === "/lien-he" || pathname === "/gioi-thieu") return <>{children}</>;

  return <div className="grid gap-5 py-10 p:mx-2 p:w-auto p:grid-cols-1 d:mx-auto d:w-[1200px] d:grid-cols-4"><div className="col-span-3 min-w-0">{children}</div><CategorySidebar categories={categories} posts={posts} /></div>;
}
