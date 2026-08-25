import type { CatalogCategory } from "@/features/catalog/types";

export type CatalogCategoryBreadcrumb = Pick<
  CatalogCategory,
  "id" | "name" | "slug" | "parentId"
>;

export type CatalogCategoryNavigationContext = {
  groupCategory: CatalogCategory;
  items: CatalogCategory[];
  mode: "children" | "siblings";
};

export function flattenCatalogCategories(categories: CatalogCategory[]) {
  const result: CatalogCategory[] = [];

  function walk(items: CatalogCategory[]) {
    items.forEach((item) => {
      result.push(item);

      if (item.children?.length) {
        walk(item.children);
      }
    });
  }

  walk(categories);

  return result;
}

export function findCatalogCategoryBySlug(
  categories: CatalogCategory[],
  slug: string,
) {
  const normalizedSlug = slug.trim().toLowerCase();

  return flattenCatalogCategories(categories).find(
    (category) => category.slug.toLowerCase() === normalizedSlug,
  );
}

function sortCatalogCategories(categories: CatalogCategory[]) {
  return [...categories].sort((left, right) => {
    const sortOrderDifference =
      (left.sortOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.sortOrder ?? Number.MAX_SAFE_INTEGER);

    return sortOrderDifference || left.name.localeCompare(right.name, "vi");
  });
}

export function getDirectVisibleCatalogChildren(
  categories: CatalogCategory[],
  parentCategory: CatalogCategory,
) {
  const candidates = [
    ...(parentCategory.children ?? []),
    ...flattenCatalogCategories(categories).filter(
      (category) => category.parentId === parentCategory.id,
    ),
  ];
  const uniqueCategories = new Map<string, CatalogCategory>();

  candidates.forEach((category) => {
    if (category.isActive === false) return;
    uniqueCategories.set(category.id || category.slug, category);
  });

  return sortCatalogCategories(Array.from(uniqueCategories.values()));
}

export function getCatalogCategoryNavigationContext(
  categories: CatalogCategory[],
  currentCategory: CatalogCategory,
): CatalogCategoryNavigationContext | null {
  const directChildren = getDirectVisibleCatalogChildren(
    categories,
    currentCategory,
  );

  if (directChildren.length > 0) {
    return {
      groupCategory: currentCategory,
      items: directChildren,
      mode: "children",
    };
  }

  if (!currentCategory.parentId) return null;

  const parentCategory = flattenCatalogCategories(categories).find(
    (category) => category.id === currentCategory.parentId,
  );

  if (!isCatalogCategoryVisible(parentCategory)) return null;

  const siblingCategories = getDirectVisibleCatalogChildren(
    categories,
    parentCategory,
  );

  if (siblingCategories.length <= 1) return null;

  return {
    groupCategory: parentCategory,
    items: siblingCategories,
    mode: "siblings",
  };
}

export function isCatalogCategoryVisible(
  category?: CatalogCategory | null,
): category is CatalogCategory {
  return Boolean(category && category.isActive !== false);
}

export function getCatalogCategoryBreadcrumbs(
  categories: CatalogCategory[],
  currentCategory: CatalogCategory,
): CatalogCategoryBreadcrumb[] {
  const flatCategories = flattenCatalogCategories(categories);
  const byId = new Map(
    flatCategories.map((category) => [category.id, category]),
  );
  const breadcrumbs: CatalogCategoryBreadcrumb[] = [];
  let cursor: CatalogCategory | undefined = currentCategory;
  let guard = 0;

  while (cursor && guard < 20) {
    breadcrumbs.unshift({
      id: cursor.id,
      name: cursor.name,
      slug: cursor.slug,
      parentId: cursor.parentId,
    });

    cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined;
    guard += 1;
  }

  return breadcrumbs;
}
