import type { CatalogItem } from "@/features/catalog/types";
import { formatServiceCurrency } from "./catalog-service-detail";

export function ServiceQuickInfo({ service }: { service: CatalogItem }) {
  const items = [
    { label: "Sản phẩm", value: "Vé xe theo tuyến", description: "Thông tin tuyến xe và vé xe được trình bày như một dịch vụ cụ thể." },
    { label: "Giá tham khảo", value: formatServiceCurrency(service.finalPrice ?? service.price) || "Liên hệ", description: "Giá áp dụng được nhân viên xác nhận trực tiếp tại thời điểm đặt vé." },
    { label: "Xác nhận", value: "Qua hotline/Zalo", description: "Gửi yêu cầu trên website, sau đó nhân viên liên hệ lại để xác nhận." },
  ];

  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {items.map((item) => <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-700">{item.label}</p><p className="mt-2 text-xl font-black text-slate-950">{item.value}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></article>)}
    </section>
  );
}
