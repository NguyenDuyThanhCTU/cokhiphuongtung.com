import type { BlogPost } from "@/features/content/types";

function toPlainText(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPostPreviewText(
  post: Pick<BlogPost, "content" | "excerpt">,
  preferredSource: "content" | "excerpt",
) {
  const fallbackSource = preferredSource === "content" ? "excerpt" : "content";
  return (
    toPlainText(post[preferredSource]) || toPlainText(post[fallbackSource])
  );
}
