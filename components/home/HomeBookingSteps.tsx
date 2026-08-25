import { ClipboardList, Hammer, Ruler, ShieldCheck } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Tiếp nhận yêu cầu", description: "Lắng nghe nhu cầu, mẫu mong muốn, kích thước dự kiến và điều kiện công trình." },
  { icon: Ruler, title: "Khảo sát & tư vấn", description: "Kiểm tra thực tế, tư vấn vật liệu, kết cấu và giải pháp phù hợp với không gian." },
  { icon: Hammer, title: "Gia công hoàn thiện", description: "Sản xuất theo bản vẽ, kiểm soát kỹ mối hàn, hoa văn, bề mặt và lớp bảo vệ." },
  { icon: ShieldCheck, title: "Lắp đặt & nghiệm thu", description: "Thi công đúng kỹ thuật, vệ sinh hoàn thiện và bàn giao sau khi khách hàng kiểm tra." },
];

export default function HomeBookingSteps() {
  return (
    <section className="relative overflow-hidden bg-[#241b14] py-16 text-white d:py-20">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,transparent_48%,rgba(243,197,41,.18)_49%,rgba(243,197,41,.18)_51%,transparent_52%)] [background-size:44px_44px]" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 d:px-0">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-UTMFleur text-[38px] leading-none text-mainColor">Tận tâm từ ý tưởng đến công trình</p>
          <h2 className="mt-3 font-UTMAmericanSans text-[31px] uppercase tracking-[0.08em] d:text-[40px]">Quy trình xử lý chuyên nghiệp</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-7 text-stone-300">Mỗi hạng mục được thực hiện theo một quy trình rõ ràng để bảo đảm tính thẩm mỹ, độ bền và sự phù hợp với công trình thực tế.</p>
        </header>

        <div className="relative mt-12 grid gap-5 sm:grid-cols-2 d:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-mainColor/45 d:block" />
          {steps.map((step, index) => (
            <article key={step.title} className="relative border border-white/10 bg-black/20 px-5 pb-6 pt-8 text-center backdrop-blur-sm">
              <span className="absolute -top-3 left-4 font-iCielPequena text-[18px] text-mainColor">0{index + 1}</span>
              <span className="relative z-10 mx-auto flex h-16 w-16 rotate-45 items-center justify-center border border-mainColor bg-[#2f241a] shadow-[0_0_0_6px_rgba(243,197,41,0.08)]"><step.icon className="-rotate-45 text-mainColor" size={27} aria-hidden="true" /></span>
              <h3 className="mt-7 font-iCielPequena text-[20px] uppercase tracking-wide text-mainColor">{step.title}</h3>
              <p className="mt-3 text-sm font-light leading-7 text-stone-300">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
