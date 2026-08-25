import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import BlogsH1 from "@/components/blogs/BlogsH1";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

export const metadata: Metadata = {
  title: "Liên hệ đặt vé xe Hà Giang",
  description:
    "Liên hệ đặt vé xe Hà Giang qua hotline, Facebook Fanpage, Messenger, Zalo, TikTok hoặc Instagram để được tư vấn và xác nhận nhanh.",
  alternates: { canonical: "/lien-he" },
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();

  return (
    <>
      <BlogsH1
        Content="Liên hệ đặt vé"
        description="Hotline hỗ trợ 24/7 và các kênh Facebook, Messenger, Zalo, TikTok, Instagram chính thức."
      />
      <div className="bg-bgcontent py-12 d:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
          <Contact settings={settings} />
        </div>
      </div>
    </>
  );
}
