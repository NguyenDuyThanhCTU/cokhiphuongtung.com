import Link from "next/link";
import { ArrowRight, CircleHelp, Phone } from "lucide-react";

import type { FaqItem } from "@/features/content/types";
import type { PublicSiteSettings } from "@/features/site/types";
import { getPhoneHref, getPrimaryHotline } from "@/features/site/utils/contact";

const fallbackFaqs: FaqItem[] = [
  { id: "fallback-quote", question: "Tôi cần cung cấp gì để nhận báo giá?", answer: "Hãy gửi loại sản phẩm, kích thước dự kiến, địa điểm thi công và hình ảnh tham khảo nếu có. Đội ngũ Phương Tùng sẽ liên hệ để tư vấn.", isActive: true },
  { id: "fallback-price", question: "Giá hiển thị trên website có phải giá cuối cùng không?", answer: "Giá trên website là mức tham khảo. Giá vé áp dụng sẽ được nhân viên xác nhận trực tiếp tại thời điểm tiếp nhận yêu cầu.", isActive: true },
  { id: "fallback-confirm", question: "Gửi form có đồng nghĩa vé đã được xác nhận không?", answer: "Chưa. Form giúp tiếp nhận nhu cầu của bạn. Vé chỉ được xác nhận sau khi nhân viên liên hệ và hai bên thống nhất thông tin.", isActive: true },
];

export default function HomeFAQSection({ settings, faqs }: { settings: PublicSiteSettings; faqs: FaqItem[] }) {
  const items = (faqs?.length ? faqs : fallbackFaqs).filter((item) => item.isActive !== false).slice(0, 8);
  const hotline = getPrimaryHotline(settings);

  return (
    <section className="bg-bgcontent py-14 d:py-20">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 sm:px-6 d:grid-cols-[0.8fr_1.2fr] d:px-0">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600"><CircleHelp size={17} /> Giải đáp nhanh</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Câu hỏi thường gặp</h2>
          <p className="mt-4 leading-7 text-slate-600">Thông tin giúp bạn hiểu rõ quy trình tư vấn, báo giá và thi công.</p>
          <div className="mt-7 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm font-bold text-slate-300">Bạn cần hỗ trợ ngay?</p>
            <a href={getPhoneHref(hotline)} className="mt-2 block text-2xl font-black text-brand-300">{hotline}</a>
            <Link href="/bao-gia" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-white">Gửi yêu cầu báo giá <ArrowRight size={16} /></Link>
          </div>
        </div>

        <div className="grid gap-3">
          {items.map((item, index) => (
            <details key={item.id || `${item.question}-${index}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-brand-300">
              <summary className="flex cursor-pointer list-none items-start gap-4 font-extrabold text-slate-900 [&::-webkit-details-marker]:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-xs text-brand-800">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex-1 pt-1 leading-6">{item.question}</span>
                <span className="text-2xl font-light text-brand-700 transition group-open:rotate-45">+</span>
              </summary>
              <p className="ml-12 mt-4 border-l-2 border-brand-200 pl-4 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
