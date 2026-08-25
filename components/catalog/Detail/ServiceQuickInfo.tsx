import type { CatalogItem } from "@/features/catalog/types";
import { formatServiceCurrency } from "./catalog-service-detail";

export function ServiceQuickInfo({ service }: { service: CatalogItem }) {
  const items = [
    { label: "Hạng mục", value: service.category?.name ?? service.categories?.[0]?.name ?? "Gia công theo yêu cầu", description: "Sản phẩm được tư vấn theo nhu cầu và điều kiện thực tế của công trình." },
    { label: "Giá tham khảo", value: formatServiceCurrency(service.finalPrice ?? service.price) || "Liên hệ", description: "Giá chính xác phụ thuộc kích thước, vật liệu và phương án thi công." },
    { label: "Tư vấn", value: "Qua hotline/Zalo", description: "Gửi yêu cầu trên website để đội ngũ kỹ thuật liên hệ và trao đổi chi tiết." },
  ];

  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {items.map((item) => <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-700">{item.label}</p><p className="mt-2 text-xl font-black text-slate-950">{item.value}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></article>)}
    </section>
  );
}
