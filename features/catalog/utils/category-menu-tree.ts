import type { CatalogCategory } from "@/features/catalog/types";

export type CatalogCategoryMenuNode = Omit<CatalogCategory, "children"> & {
  children: CatalogCategoryMenuNode[];
};

type CategoryRecord = {
  category: CatalogCategory;
  index: number;
};

function compareCategoryRecords(left: CategoryRecord, right: CategoryRecord) {
  return (
    (left.category.sortOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.category.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
    left.index - right.index
  );
}

export function buildCatalogCategoryMenuTree(
  categories: CatalogCategory[],
): CatalogCategoryMenuNode[] {
  const records = new Map<string, CategoryRecord>();
  let sequence = 0;

  const collect = (category: CatalogCategory, inheritedParentId?: string | null) => {
    if (category.isActive === false) return;

    const id = String(category.id);
    const existing = records.get(id);
    const parentId = category.parentId ?? inheritedParentId ?? null;
    records.set(id, {
      category: { ...existing?.category, ...category, parentId },
      index: existing?.index ?? sequence++,
    });

    category.children?.forEach((child) => collect(child, id));
  };

  categories.forEach((category) => collect(category));

  const nodes = new Map<string, CatalogCategoryMenuNode>();
  records.forEach(({ category }) => {
    nodes.set(String(category.id), { ...category, children: [] });
  });

  const roots: CatalogCategoryMenuNode[] = [];
  Array.from(records.values())
    .sort(compareCategoryRecords)
    .forEach(({ category }) => {
    const node = nodes.get(String(category.id));
    if (!node) return;

    const parent = category.parentId
      ? nodes.get(String(category.parentId))
      : undefined;

    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
    });

  const sortChildren = (node: CatalogCategoryMenuNode) => {
    node.children.sort((left, right) => {
      const leftRecord = records.get(String(left.id));
      const rightRecord = records.get(String(right.id));
      if (!leftRecord || !rightRecord) return 0;
      return compareCategoryRecords(leftRecord, rightRecord);
    });
    node.children.forEach(sortChildren);
  };

  roots.forEach(sortChildren);
  return roots;
}
