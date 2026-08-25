import { CheckCircle2, Headphones, Search, Send } from "lucide-react";

const steps = [
  { icon: Search, title: "Chọn hạng mục", description: "Tham khảo sản phẩm hoặc mô tả nhu cầu thực tế của công trình." },
  { icon: Send, title: "Gửi yêu cầu", description: "Cung cấp kích thước, địa điểm và thông tin liên hệ cơ bản." },
  { icon: Headphones, title: "Nhận tư vấn", description: "Đội ngũ kỹ thuật liên hệ làm rõ phương án và gửi báo giá." },
];

export default function HomeBookingSteps() {
  return (
    <section className="bg-slate-950 py-14 text-white d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-300"><CheckCircle2 size={16} /> Quy trình đơn giản</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Nhận tư vấn chỉ với 3 bước</h2>
          <p className="mt-4 leading-7 text-slate-300">Mỗi báo giá được xây dựng theo yêu cầu, kích thước và điều kiện thi công thực tế.</p>
        </div>
        <div className="mt-9 grid gap-4 d:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <span className="absolute right-5 top-4 text-5xl font-black text-white/[0.05]">0{index + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-400 text-slate-950"><step.icon size={23} aria-hidden="true" /></span>
              <h3 className="mt-5 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
