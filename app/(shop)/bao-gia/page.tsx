import type { Metadata } from "next";
import BlogsH1 from "@/components/blogs/BlogsH1";
import QuoteRequestSection from "@/components/layout/Booking";
import { getPublicSiteSettings } from "@/features/site/services/site.service";

export const metadata: Metadata = {
  title: "Yêu cầu báo giá",
  description: "Gửi yêu cầu báo giá sản phẩm cơ khí, sắt mỹ thuật và hạng mục thi công theo kích thước thực tế.",
  alternates: { canonical: "/bao-gia" },
};

export default async function QuotePage() {
  const settings = await getPublicSiteSettings();
  return <><div><BlogsH1 Content="Để lại thông tin" /><p>Chúng tôi sẽ tư vấn cho bạn</p></div><QuoteRequestSection settings={settings} /></>;
}
