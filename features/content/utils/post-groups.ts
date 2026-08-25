import type { BlogPost } from "@/features/content/types";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function isPostInGroup(post: BlogPost, group: "du-an" | "video") {
  const categoryValue = `${post.category?.slug ?? ""} ${post.category?.name ?? ""}`;
  const normalized = normalize(categoryValue);
  return group === "du-an"
    ? normalized.includes("du-an") || normalized.includes("du an")
    : normalized.includes("video");
}

export function getPostsInGroup(posts: BlogPost[], group: "du-an" | "video") {
  return posts.filter((post) => isPostInGroup(post, group));
}

export function extractYouTubeEmbedUrl(html?: string | null) {
  if (!html) return null;
  const decoded = html.replace(/&amp;/g, "&");
  const match = decoded.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  return match?.[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}
