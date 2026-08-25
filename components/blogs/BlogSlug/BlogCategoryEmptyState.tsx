export type BlogCategoryEmptyStateProps = {
  title?: string;
  description?: string;
};

export default function BlogCategoryEmptyState({
  title = "Chưa có bài viết phù hợp",
  description = "Hãy thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác.",
}: BlogCategoryEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center shadow-sm">
      <p className="text-lg font-semibold text-zinc-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}
