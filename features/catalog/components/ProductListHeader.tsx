import type { CatalogListResult } from "@/features/catalog/types";

type ProductListHeaderProps = {
  result: CatalogListResult;
};

export function ProductListHeader({ result }: ProductListHeaderProps) {
  const total = result.meta?.total ?? result.items.length;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold tracking-normal text-zinc-950">Sản phẩm và dịch vụ</h1>
      <p className="mt-2 text-sm text-zinc-600">{total} mục đang hiển thị</p>
    </div>
  );
}
