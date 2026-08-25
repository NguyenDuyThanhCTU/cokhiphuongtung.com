import Link from "next/link";
import { Phone, Send } from "lucide-react";
import type { CatalogItem } from "@/features/catalog/types";
import { getPhoneHref } from "@/features/site/utils/contact";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { getServicePriceInfo } from "./catalog-service-detail";

export function ServicePriceBox({
  service,
  hotline,
}: {
  service: CatalogItem;
  hotline?: string;
}) {
  const priceInfo = getServicePriceInfo(service);
  const bookingHref = `/bao-gia?san-pham=${encodeURIComponent(service.title)}#yeu-cau-bao-gia`;

  return (
    <aside className="rounded-3xl border border-brand-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
        {priceInfo.label}
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-black tracking-tight text-slate-950">
          {priceInfo.value}
        </p>
        {priceInfo.originalValue ? (
          <p className="pb-1 text-sm font-medium text-slate-400 line-through">
            {priceInfo.originalValue}
          </p>
        ) : null}
      </div>
      {/* <p className="mt-3 text-sm leading-6 text-slate-600">{priceInfo.note}</p> */}
      {service.specs ? (
        <HtmlContent html={service.specs} className="mt-4" />
      ) : null}
      <div className="mt-6 grid gap-3">
        <Link
          href={bookingHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-brand-300"
        >
          <Send size={17} /> Yêu cầu báo giá
        </Link>
        {hotline ? (
          <a
            href={getPhoneHref(hotline)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-600"
          >
            <Phone size={17} /> Gọi tư vấn
          </a>
        ) : null}
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Báo giá chính xác được xác nhận sau khi trao đổi yêu cầu thực tế.
      </p>
    </aside>
  );
}
