import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import BlogsH1 from "@/components/blogs/BlogsH1";

const policies = [
  { slug: "chinh-sach-bao-mat", title: "Chính sách bảo mật", description: "Cách chúng tôi tiếp nhận, sử dụng và bảo vệ thông tin liên hệ của khách hàng." },
  { slug: "dieu-khoan-su-dung", title: "Điều khoản sử dụng", description: "Các nguyên tắc khi tham khảo nội dung và gửi yêu cầu trên website." },
];

export const metadata: Metadata = {
  title: "Chính sách",
  description: "Các chính sách về thông tin, sử dụng website và bảo hành của Cơ Khí Phương Tùng.",
  alternates: { canonical: "/chinh-sach" },
};

export default function PolicyIndexPage() {
  return <><BlogsH1 Content="Chính sách" description="Thông tin minh bạch giúp khách hàng thuận tiện khi tìm hiểu sản phẩm và làm việc cùng Phương Tùng." /><main className="min-h-[480px] bg-bgcontent py-12"><div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6"><div className="grid gap-5 sm:grid-cols-2">{policies.map((policy, index) => <Link key={policy.slug} href={`/chinh-sach/${policy.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">{index === 0 ? <ShieldCheck size={24} /> : <FileCheck2 size={24} />}</span><h2 className="mt-5 text-xl font-extrabold text-slate-950">{policy.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{policy.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-700">Xem chi tiết <ArrowRight size={16} /></span></Link>)}</div></div></main></>;
}
