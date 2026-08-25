"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { catalogSortOptions } from "@/features/catalog/constants";
import type { CatalogSortOption } from "@/features/catalog/types";

type ProductSortSelectProps = {
  value?: CatalogSortOption;
};

export function ProductSortSelect({ value }: ProductSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(nextValue: string) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (nextValue) {
      params.set("sort", nextValue);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <label className="block text-sm font-medium text-zinc-800">
      <span className="mb-1 block">Sắp xếp</span>
      <select
        className="min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950"
        value={value ?? ""}
        onChange={(event) => updateSort(event.target.value)}
      >
        <option value="">Mặc định</option>
        {catalogSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
