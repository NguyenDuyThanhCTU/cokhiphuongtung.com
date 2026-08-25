import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

import { SocialLinks } from "@/components/layout/SocialLinks";
import type { PublicSiteSettings } from "@/features/site/types";
import { getHotlines, getPhoneHref } from "@/features/site/utils/contact";

export default function Contact({
  settings,
}: {
  settings: PublicSiteSettings;
}) {
  const hotlines = getHotlines(settings);
  const email = settings.contact?.email || settings.email;

  return (
    <section className="grid gap-8 d:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700">
          Liên hệ hỗ trợ
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          Tư vấn tuyến xe và vé xe Hà Giang
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">
          Liên hệ hotline, Messenger, Zalo hoặc các kênh truyền thông chính
          thức. Đội ngũ tư vấn sẽ phản hồi và xác nhận thông tin trực tiếp.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
              <Phone size={19} />
            </span>
            <h2 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-slate-500">
              Hotline 24/7
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {hotlines.map((hotline) => (
                <a
                  key={hotline}
                  href={getPhoneHref(hotline)}
                  className="text-xl font-black text-slate-950 hover:text-brand-700"
                >
                  {hotline}
                </a>
              ))}
            </div>
          </article>

          {email ? (
            <a
              href={`mailto:${email}`}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
            >
              <Mail size={20} className="text-brand-700" />
              <h2 className="mt-4 font-extrabold text-slate-950">Email</h2>
              <p className="mt-2 break-all text-sm text-slate-500">{email}</p>
            </a>
          ) : null}
          {settings.address ? (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
              <MapPin size={20} className="text-brand-700" />
              <h2 className="mt-4 font-extrabold text-slate-950">Địa chỉ</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {settings.address}
              </p>
            </article>
          ) : null}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-600">
              Kênh tư vấn và truyền thông
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Theo dõi thông tin tuyến xe hoặc nhắn tin trực tiếp qua kênh phù
              hợp với bạn.
            </p>
            <SocialLinks settings={settings} className="mt-4" />
          </section>
        </div>
      </div>

      <aside className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-400 text-slate-950">
          <Send size={22} />
        </span>
        <h2 className="mt-5 text-2xl font-black">Bạn muốn đặt vé?</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Form đặt vé nằm ngay cuối trang. Chỉ cần nhập tuyến xe, ngày dự kiến,
          số lượng vé và thông tin liên hệ.
        </p>
        <div className="mt-6 grid gap-3 text-sm text-slate-300">
          <p className="flex items-start gap-3">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-brand-300" />
            {settings.workingHours?.weekday || "Hỗ trợ tiếp nhận yêu cầu 24/7"}
          </p>
          <p className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-brand-300" />
            Nhân viên liên hệ để xác nhận thông tin
          </p>
        </div>
        <Link
          href="#dat-ve"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-brand-300"
        >
          Đi tới form đặt vé
        </Link>
        {settings.mapIframe ? (
          <div
            className="footer-map mt-6 overflow-hidden rounded-2xl border border-white/10"
            dangerouslySetInnerHTML={{ __html: settings.mapIframe }}
          />
        ) : null}
      </aside>
    </section>
  );
}
