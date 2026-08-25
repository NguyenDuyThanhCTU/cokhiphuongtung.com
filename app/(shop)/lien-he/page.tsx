import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

export const metadata: Metadata = {
  title: "Liên hệ Cơ Khí Phương Tùng",
  description:
    "Liên hệ Cơ Khí Phương Tùng qua hotline, Zalo và các kênh chính thức để được tư vấn sản phẩm, khảo sát và báo giá.",
  alternates: { canonical: "/lien-he" },
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();

  return (
      <div className="p:mx-2 p:w-auto d:mx-auto d:w-[1300px]">
          <Contact settings={settings} />
      </div>
  );
}
