import type { CatalogListQuery } from "@/features/catalog/types";

export function buildCatalogQuery(query: CatalogListQuery = {}): string {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const search = params.toString();
  return search ? `?${search}` : "";
}
