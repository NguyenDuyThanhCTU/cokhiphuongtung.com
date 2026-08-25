import type { CatalogListQuery, CatalogListResult } from "@/features/catalog/types";

type CatalogPageHeaderProps = {
  query: CatalogListQuery;
  meta?: CatalogListResult["meta"];
};

export function CatalogPageHeader({ query, meta }: CatalogPageHeaderProps) {
  const total = meta?.total ?? 0;
  const hasFilter = Boolean(
    query.q ||
      query.tag ||
      query.featured ||
      query.bestSeller ||
      query.discounted ||
      query.sort,
  );

  return (
    <section className="mb-6 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-5 text-zinc-900 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Tuyến xe / Vé xe
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
            Danh sách tuyến xe và vé xe
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
            Tìm tuyến xe phù hợp, tham khảo giá vé và gửi yêu cầu đặt vé nhanh.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white px-5 py-4 text-left shadow-sm md:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {hasFilter ? "Kết quả phù hợp" : "Tổng số tuyến/vé"}
          </p>
          <p className="mt-1 text-3xl font-bold text-brand-700">{total}</p>
        </div>
      </div>
    </section>
  );
}
