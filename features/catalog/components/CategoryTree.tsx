import Link from "next/link";
import type { CatalogCategory } from "@/features/catalog/types";
import { routes } from "@/lib/constants/routes";

type CategoryTreeProps = {
  categories: CatalogCategory[];
};

export function CategoryTree({ categories }: CategoryTreeProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <Link className="text-sm text-zinc-700 hover:text-zinc-950" href={`${routes.products}?category=${category.slug}`}>
            {category.name}
          </Link>
          {category.children && category.children.length > 0 ? (
            <div className="ml-4 mt-2">
              <CategoryTree categories={category.children} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
