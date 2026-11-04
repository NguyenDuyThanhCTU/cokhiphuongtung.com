import type { CatalogItem } from "@/features/catalog/types";

function getCreatedAtTimestamp(item: CatalogItem) {
  const timestamp = Date.parse(item.createdAt ?? "");

  return Number.isFinite(timestamp) ? timestamp : 0;
}

/**
 * Homepage collections always show featured products first. Products in each
 * group are then ordered from newest to oldest by their creation date.
 */
export function sortHomeCatalogItems(items: CatalogItem[]) {
  return [...items].sort((left, right) => {
    const featuredDifference =
      Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured));

    return (
      featuredDifference ||
      getCreatedAtTimestamp(right) - getCreatedAtTimestamp(left)
    );
  });
}
