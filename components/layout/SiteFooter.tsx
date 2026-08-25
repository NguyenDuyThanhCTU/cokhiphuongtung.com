import Link from "next/link";

import type { CatalogCategory } from "@/features/catalog/types";
import { SITE_FALLBACK } from "@/features/site/constants";
import type { PublicSiteSettings } from "@/features/site/types";
import { getHotlines } from "@/features/site/utils/contact";

type SiteFooterProps = { settings: PublicSiteSettings; catalogCategories: CatalogCategory[] };

const policies = [
  { href: "/chinh-sach/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/chinh-sach/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
];

export function SiteFooter({ settings }: SiteFooterProps) {
  const siteName = settings.siteName && settings.siteName !== "Website" ? settings.siteName : SITE_FALLBACK.name;
  const hotlines = getHotlines(settings);
  const email = settings.contact?.email || settings.email;

  return (
    <footer className="font-LexendDeca text-white">
      <div className="bg-mainColorHover">
        <div className="grid gap-10 py-10 p:mx-2 p:w-auto p:grid-cols-1 d:mx-auto d:w-[1200px] d:grid-cols-3 d:text-[16px]">
          <section>
            <h2 className="text-[22px] font-normal uppercase">{siteName}</h2>
            <div className="mt-3 flex flex-col gap-2 text-[15px]">
              {settings.address ? <p>Địa chỉ: {settings.address}</p> : null}
              {hotlines.length ? <p>Số điện thoại: {hotlines.join(" - ")}</p> : null}
              {email ? <p>Email: {email}</p> : null}
            </div>
            <div className="mt-3 flex flex-col gap-2 text-[15px]"><p>Đang online: 25</p></div>
          </section>
          <section>
            <h2 className="text-[18px] font-normal uppercase">Điều khoản sử dụng</h2>
            <nav className="mt-3 flex flex-col gap-2 text-[15px]">
              {policies.map((item) => <Link key={item.href} href={item.href} className="hover:text-blue-500 hover:underline">{item.label}</Link>)}
              <Link href="/chinh-sach" className="hover:text-blue-500 hover:underline">Tất cả chính sách</Link>
            </nav>
          </section>
          <section>
            <h2 className="text-[22px] font-normal uppercase">Kết nối với chúng tôi</h2>
            <div className="mt-3 h-[220px] overflow-hidden">
              {settings.mapIframe ? <div className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" dangerouslySetInnerHTML={{ __html: settings.mapIframe }} /> : <div className="flex h-full items-center justify-center border border-white/20 text-sm text-white/70">Bản đồ đang được cập nhật</div>}
            </div>
          </section>
        </div>
      </div>
      <div className="flex justify-center bg-black px-2 py-5 text-center text-[14px] font-normal">
        <p className="pr-2">©{new Date().getFullYear()} All Rights reserved</p>
        <p className="border-l border-gray-400 pl-2">Designed by ADS Company</p>
      </div>
    </footer>
  );
}
