"use client";

import { useState } from "react";
import type { CatalogVariant } from "@/features/catalog/types";
import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import { cn } from "@/lib/utils/cn";

type VariantSelectorProps = {
  variants?: CatalogVariant[];
};

function getVariantLabel(variant: CatalogVariant): string {
  return [variant.name, variant.size, variant.color, variant.volume].filter(Boolean).join(" / ") || "Biến thể";
}

export function VariantSelector({ variants = [] }: VariantSelectorProps) {
  const visibleVariants = variants.filter((variant) => variant.isActive !== false);
  const [selectedId, setSelectedId] = useState<string | undefined>(visibleVariants[0]?.id);

  if (visibleVariants.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-950">Biến thể</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {visibleVariants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            className={cn(
              "rounded-md border px-3 py-2 text-left text-sm transition",
              selectedId === variant.id
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
            )}
            onClick={() => setSelectedId(variant.id)}
          >
            <span className="block font-medium">{getVariantLabel(variant)}</span>
            <span className="block text-xs opacity-80">{getProductPriceLabel(variant)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
