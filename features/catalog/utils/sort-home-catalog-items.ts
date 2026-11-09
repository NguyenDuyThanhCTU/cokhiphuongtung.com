import type { CatalogItem } from "@/features/catalog/types";

function getCreatedAtTimestamp(item: CatalogItem) {
  const timestamp = Date.parse(item.createdAt ?? "");

  return Number.isFinite(timestamp) ? timestamp : 0;
}

/**
 * Show every featured product first. Products in the featured and regular
 * groups are each ordered from newest to oldest by creation date.
 */
export function sortCatalogItemsFeaturedFirst(items: CatalogItem[]) {
  return [...items].sort((left, right) => {
    const featuredDifference =
      Number(Boolean(right.isFeatured)) - Number(Boolean(left.isFeatured));

    return (
      featuredDifference ||
      getCreatedAtTimestamp(right) - getCreatedAtTimestamp(left)
    );
  });
}
