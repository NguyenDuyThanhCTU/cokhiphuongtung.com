import { CategoryTree } from "@/features/catalog/components/CategoryTree";
import type { CatalogCategory } from "@/features/catalog/types";

type CategoryListProps = {
  categories: CatalogCategory[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-zinc-950">Danh mục</h2>
      <CategoryTree categories={categories} />
    </section>
  );
}
