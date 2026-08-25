import type { BlogPost } from "@/features/content/types";
import { extractYouTubeEmbedUrl } from "@/features/content/utils/post-groups";

export function VideoGallery({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return <div className="border bg-white p-10 text-center">Video đang được cập nhật</div>;
  return <div className="grid w-full gap-5 p:grid-cols-2 d:grid-cols-3">{posts.map((post) => { const videoUrl = extractYouTubeEmbedUrl(post.content); return <div key={post.id} className="h-[200px] w-full border-2 border-slate-300 shadow-lg">{videoUrl ? <iframe src={videoUrl} title={post.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <div className="flex h-full items-center justify-center p-3 text-center">{post.title}</div>}</div>; })}</div>;
}
