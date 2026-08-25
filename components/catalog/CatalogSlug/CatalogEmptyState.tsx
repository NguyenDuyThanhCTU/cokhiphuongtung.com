type CatalogEmptyStateProps = {
  title?: string;
  description?: string;
};

export function CatalogEmptyState({
  title = "Không có dịch vụ phù hợp.",
  description = "Hãy thử thay đổi từ khóa, tag hoặc bộ lọc để xem thêm kết quả.",
}: CatalogEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-zinc-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}
