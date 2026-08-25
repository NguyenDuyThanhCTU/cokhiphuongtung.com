import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone, Ticket } from "lucide-react";

import type { CatalogItem } from "@/features/catalog/types";
import { getProductPriceLabel } from "@/features/catalog/utils/get-product-price-label";
import type { PublicSiteSettings } from "@/features/site/types";
import { getPhoneHref, getPrimaryHotline } from "@/features/site/utils/contact";

export const InterprovincialCard = ({
  Data,
  Hotline,
}: {
  Data: CatalogItem;
  Hotline: string;
}) => {
  const categoryName = Data.category?.name ?? Data.categories?.[0]?.name;
  const priceLabel = getProductPriceLabel(Data, "Liên hệ");
  const detailHref = `/dich-vu/${Data.slug}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
      <Link href={detailHref} className="relative block aspect-[16/10] overflow-hidden bg-slate-100" aria-label={`Xem ${Data.title}`}>
        {Data.thumbnailUrl ? (
          <Image
            src={Data.thumbnailUrl}
            alt={Data.title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(245,184,0,0.7),transparent_38%),linear-gradient(135deg,#f8fafc,#e2e8f0)] text-brand-700">
            <Ticket size={42} aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="rounded-full bg-brand-400 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-950">
            {categoryName || "Vé xe Hà Giang"}
          </span>
          {Data.isFeatured ? <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800">Nổi bật</span> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-extrabold leading-snug text-slate-950">
          <Link href={detailHref} className="transition hover:text-brand-700">{Data.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {Data.shortDescription || "Xem thông tin tuyến xe, giá vé tham khảo và gửi yêu cầu đặt vé nhanh."}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <CheckCircle2 size={16} className="shrink-0 text-brand-600" aria-hidden="true" />
          Nhân viên liên hệ xác nhận trực tiếp
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-semibold text-slate-500">Giá vé tham khảo</p>
            <p className="mt-1 text-xl font-black text-brand-700">{priceLabel}</p>
          </div>
          <Link href={detailHref} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm font-extrabold text-brand-800 transition hover:bg-brand-400 hover:text-slate-950">
            Chi tiết <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <a href={Hotline ? getPhoneHref(Hotline) : "/lien-he"} data-track="click_ticket_phone" data-service-title={Data.title} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-500 hover:text-slate-950">
          <Phone size={16} aria-hidden="true" />
          Gọi tư vấn vé
        </a>
      </div>
    </article>
  );
};

const HomeProducts = ({
  title,
  Data,
  settings,
}: {
  title: string;
  Data: CatalogItem[];
  settings: PublicSiteSettings;
}) => {
  if (!Data?.length) return null;

  const hotline = getPrimaryHotline(settings);

  return (
    <section className="bg-bgcontent py-14 d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">Tuyến xe đề xuất</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-4 leading-7 text-slate-600">Tham khảo thông tin, giá vé và gửi yêu cầu để được xác nhận nhanh.</p>
          </div>
          <Link href="/danh-muc" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-700 transition hover:text-brand-500">Xem tất cả <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 d:grid-cols-3">
          {Data.map((item) => (
            <InterprovincialCard key={item.id} Data={item} Hotline={hotline} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;
