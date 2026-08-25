import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone, TicketCheck } from "lucide-react";

import type { BannerItem } from "@/features/content/types";
import { SITE_FALLBACK } from "@/features/site/constants";
import type { PublicSiteSettings } from "@/features/site/types";
import { getHotlines, getPhoneHref } from "@/features/site/utils/contact";

type HeroProps = {
  Data: BannerItem[];
  settings: PublicSiteSettings;
};

export default function Hero({ Data, settings }: HeroProps) {
  const heroBanner = Data.find((banner) => Boolean(banner.imageUrl));
  const hotlines = getHotlines(settings);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,184,0,0.24),transparent_34%),radial-gradient(circle_at_85%_70%,rgba(245,184,0,0.12),transparent_28%)]" />
      <div className="relative mx-auto grid min-h-[560px] w-full max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-6 d:grid-cols-[1.05fr_0.95fr] d:px-0 d:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-300/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-300">
            <TicketCheck size={16} aria-hidden="true" />
            Tuyến xe & vé xe Hà Giang
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl d:text-[60px]">
            Đặt vé xe Hà Giang
            <span className="block text-brand-300">nhanh và rõ ràng</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Khám phá các tuyến xe phù hợp, tham khảo giá vé và gửi yêu cầu đặt vé. Nhân viên sẽ liên hệ trực tiếp để xác nhận thông tin.
          </p>

          <div className="mt-7 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
            {["Nhiều tuyến lựa chọn", "Giá vé dễ tham khảo", "Hỗ trợ đặt vé 24/7"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-brand-300" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/danh-muc" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-[0_12px_35px_rgba(245,184,0,0.25)] transition hover:bg-brand-300">
              Xem các tuyến xe
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="#dat-ve" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:border-brand-300 hover:text-brand-300">
              Gửi yêu cầu đặt vé
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotline</span>
            {hotlines.map((hotline) => (
              <a key={hotline} href={getPhoneHref(hotline)} className="inline-flex items-center gap-2 text-lg font-black text-white transition hover:text-brand-300" data-track="click_hotline_hero">
                <Phone size={17} className="text-brand-300" aria-hidden="true" />
                {hotline}
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] d:mx-0">
          <div className="absolute -inset-4 rounded-[36px] border border-brand-300/20" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-brand-300 via-brand-400 to-brand-600 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            {heroBanner?.imageUrl ? (
              <Image
                src={heroBanner.imageUrl}
                alt={heroBanner.title || SITE_FALLBACK.name}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center text-slate-950">
                <span className="text-7xl font-black tracking-tighter sm:text-8xl">HG</span>
                <span className="mt-2 text-sm font-extrabold uppercase tracking-[0.24em]">Hành trình của bạn</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">Xe Khách Hà Giang 24H</p>
              <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">Chọn tuyến phù hợp, gửi yêu cầu trong vài phút</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
