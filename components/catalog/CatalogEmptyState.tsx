import Link from "next/link";

export function CatalogEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-700 shadow-sm">
      <p className="text-lg font-semibold text-zinc-950">Không tìm thấy tuyến xe hoặc vé xe phù hợp</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Hãy thử đổi từ khóa, bỏ bớt bộ lọc hoặc quay lại danh sách tất cả tuyến xe.
      </p>
      <Link
        href="/danh-muc"
        className="mt-5 inline-flex rounded-full bg-brand-400 px-5 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-brand-300"
      >
        Xem tất cả tuyến xe
      </Link>
    </div>
  );
}
