import type { BlogPost } from "@/features/content/types";
import BlogCategoryEmptyState from "./BlogCategoryEmptyState";
import { BlogCard } from "@/components/home/HomeNews";

export type BlogCategoryPostGridProps = {
  posts: BlogPost[];
};

export default function BlogCategoryPostGrid({
  posts,
}: BlogCategoryPostGridProps) {
  if (posts.length === 0) {
    return <BlogCategoryEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 d:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id}>
          <BlogCard Data={post} />
        </div>
      ))}
    </div>
  );
}
