import Link from "next/link";
import type { CatalogItem } from "@/features/catalog/types";
import { getPhoneHref } from "@/features/site/utils/contact";

export function ServiceFinalCta({ service, hotline }: { service: CatalogItem; hotline?: string }) {
  return (
    <section className="mt-12 overflow-hidden rounded-[28px] bg-brand-400 p-6 text-slate-950 shadow-[0_20px_70px_rgba(245,184,0,0.24)] sm:p-8 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-800">Bạn quan tâm sản phẩm này?</p><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Nhận báo giá {service.title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-800">Cung cấp kích thước, địa điểm và số điện thoại. Đội ngũ kỹ thuật sẽ liên hệ để tư vấn phương án phù hợp.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link href={`/bao-gia?san-pham=${encodeURIComponent(service.title)}#yeu-cau-bao-gia`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-700">Yêu cầu báo giá</Link>
          {hotline ? <a href={getPhoneHref(hotline)} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-900/20 bg-white/60 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-white">Gọi hotline</a> : null}
        </div>
      </div>
    </section>
  );
}
