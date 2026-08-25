import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import { VideoGallery } from "@/components/content/VideoGallery";
import { getBlogPosts } from "@/features/content/services/content.service";
import { getPostsInGroup } from "@/features/content/utils/post-groups";

export const metadata: Metadata = {
  title: "Video thi công và sản phẩm",
  description: "Video giới thiệu sản phẩm, quy trình gia công và công trình thực tế của Cơ Khí Phương Tùng.",
  alternates: { canonical: "/video" },
};

export default async function VideoPage() {
  const videos = getPostsInGroup(await getBlogPosts(), "video");
  return <><BlogsH1 Content="Video" /><VideoGallery posts={videos} /></>;
}
