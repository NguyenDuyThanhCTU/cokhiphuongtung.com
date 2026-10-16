import type { CatalogItem } from "@/features/catalog/types";

function normalizeSearchText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchableText(item: CatalogItem) {
  return normalizeSearchText(
    [
      item.title,
      item.slug,
      item.sku,
      item.specs,
      item.shortDescription,
      item.description,
      item.seoTitle,
      item.seoDescription,
      item.category?.name,
      item.category?.slug,
      ...(item.categories ?? []).flatMap((category) => [
        category.name,
        category.slug,
      ]),
      ...(item.tags ?? []).flatMap((tag) => [tag.name, tag.slug]),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function searchCatalogItems(items: CatalogItem[], query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return items;

  const tokens = Array.from(new Set(normalizedQuery.split(" "))).filter(
    Boolean,
  );

  return items
    .map((item, index) => {
      const title = normalizeSearchText(item.title);
      const searchableText = getSearchableText(item);

      if (!tokens.every((token) => searchableText.includes(token))) {
        return null;
      }

      const titleTokenMatches = tokens.filter((token) =>
        title.includes(token),
      ).length;
      const score =
        (title === normalizedQuery ? 400 : 0) +
        (title.includes(normalizedQuery) ? 200 : 0) +
        (titleTokenMatches === tokens.length ? 100 : 0) +
        titleTokenMatches * 10;

      return { item, index, score };
    })
    .filter(
      (result): result is { item: CatalogItem; index: number; score: number } =>
        result !== null,
    )
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}
