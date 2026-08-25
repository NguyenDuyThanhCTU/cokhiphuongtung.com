import { InterprovincialCard } from "@/components/home/HomeProducts";
import type { CatalogItem } from "@/features/catalog/types";

type ServiceRelatedServicesProps = {
  services: CatalogItem[];
  hotline: string;
};

export function ServiceRelatedServices({
  services,
  hotline,
}: ServiceRelatedServicesProps) {
  if (!services.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
            Có thể bạn quan tâm
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
            Sản phẩm liên quan
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => (
          <InterprovincialCard
            key={item.id ?? item.slug}
            Data={item}
            Hotline={hotline}
          />
        ))}
      </div>
    </section>
  );
}
