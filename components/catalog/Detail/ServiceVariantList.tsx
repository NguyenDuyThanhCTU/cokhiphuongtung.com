import type { CatalogItem } from "@/features/catalog/types";
import {
  getVariantDescription,
  getVariantPrice,
  getVariantTitle,
} from "./catalog-service-detail";

type ServiceVariantListProps = {
  service: CatalogItem;
};

export function ServiceVariantList({ service }: ServiceVariantListProps) {
  const variants = service.variants ?? [];

  if (!variants.length) return null;

  return (
    <section className="mt-12 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
          Lựa chọn vé
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
          Các lựa chọn đang áp dụng cho tuyến này
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Tham khảo loại vé hoặc phương án dịch vụ. Nhân viên sẽ xác nhận lựa chọn phù hợp khi liên hệ lại.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant, index) => {
          const title = getVariantTitle(variant, index);
          const description = getVariantDescription(variant);
          const price = getVariantPrice(variant);

          return (
            <article
              key={`${title}-${index}`}
              className="rounded-3xl border border-brand-100 bg-brand-50/50 p-5"
            >
              <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
              {description ? (
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              ) : null}
              <p className="mt-4 text-sm font-extrabold text-brand-700">
                {price ?? "Liên hệ xác nhận giá"}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
