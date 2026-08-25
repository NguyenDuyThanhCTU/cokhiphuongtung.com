import type { CatalogItem } from "@/features/catalog/types";
import { InterprovincialCard } from "../home/HomeProducts";

type CatalogGridProps = {
  items: CatalogItem[];
  hotline: string;
};

export function CatalogGrid({ items, hotline }: CatalogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 d:grid-cols-3">
      {items.map((item) => (
        <div key={item.id}>
          <InterprovincialCard Data={item} Hotline={hotline} />
        </div>
      ))}
    </div>
  );
}
