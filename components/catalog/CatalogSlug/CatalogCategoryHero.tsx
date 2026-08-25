import type { CatalogCategory } from "@/features/catalog/types";
import type { CatalogCategoryBreadcrumb } from "./catalog-category-tree";

export function CatalogCategoryHero({ category, total }: { category: CatalogCategory; breadcrumbs: CatalogCategoryBreadcrumb[]; total?: number }) {
  return <header className="bg-[rgba(0,0,0,0.64)] px-5 py-3 text-white"><h1 className="text-[24px] font-semibold uppercase">Tất cả sản phẩm {category.name}</h1><p className="text-[14px] font-extralight">{total ?? 0} sản phẩm</p></header>;
}
