import { CheckCircle2, Headphones, Search, Send } from "lucide-react";

const steps = [
  { icon: Search, title: "Chọn tuyến xe", description: "Xem danh sách tuyến và vé xe phù hợp với nhu cầu của bạn." },
  { icon: Send, title: "Gửi yêu cầu", description: "Điền ngày dự kiến, số lượng vé và số điện thoại liên hệ." },
  { icon: Headphones, title: "Nhận xác nhận", description: "Nhân viên gọi lại xác nhận thông tin và hướng dẫn đặt vé." },
];

export default function HomeBookingSteps() {
  return (
    <section className="bg-slate-950 py-14 text-white d:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-300"><CheckCircle2 size={16} /> Quy trình đơn giản</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Đặt vé chỉ với 3 bước</h2>
          <p className="mt-4 leading-7 text-slate-300">Website tiếp nhận yêu cầu đặt vé; thông tin cuối cùng sẽ được nhân viên xác nhận trực tiếp.</p>
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
