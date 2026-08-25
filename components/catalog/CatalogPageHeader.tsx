import type { CatalogListQuery, CatalogListResult } from "@/features/catalog/types";

export function CatalogPageHeader({ query, meta }: { query: CatalogListQuery; meta?: CatalogListResult["meta"] }) {
  return <div className="bg-[rgba(0,0,0,0.64)] px-5 py-3 text-white"><h1 className="text-[24px] font-semibold uppercase">{query.q ? `Tìm kiếm cho từ khóa: \"${query.q}\"` : "Tất cả sản phẩm"}</h1><p className="text-[14px] font-extralight">{meta?.total ?? 0} sản phẩm</p></div>;
}
