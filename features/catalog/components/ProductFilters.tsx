import { Card } from "@/components/ui/Card";
import { CategoryList } from "@/features/catalog/components/CategoryList";
import { ProductSearchBox } from "@/features/catalog/components/ProductSearchBox";
import { TagFilter } from "@/features/catalog/components/TagFilter";
import type { CatalogCategory, CatalogTag } from "@/features/catalog/types";

type ProductFiltersProps = {
  categories: CatalogCategory[];
  tags: CatalogTag[];
  query?: string;
};

export function ProductFilters({ categories, tags, query }: ProductFiltersProps) {
  return (
    <Card className="space-y-6">
      <ProductSearchBox defaultValue={query} />
      <CategoryList categories={categories} />
      <TagFilter tags={tags} />
    </Card>
  );
}
