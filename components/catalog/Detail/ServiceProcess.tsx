const processSteps = [
  { title: "Xem thông tin tuyến", description: "Tham khảo nội dung dịch vụ, giá vé và các lựa chọn đang được công bố." },
  { title: "Gửi yêu cầu đặt vé", description: "Cung cấp tuyến xe, ngày dự kiến, số lượng vé và số điện thoại." },
  { title: "Nhân viên liên hệ", description: "Đội ngũ tư vấn kiểm tra yêu cầu và liên hệ lại với hành khách." },
  { title: "Xác nhận thông tin", description: "Giá vé và hướng dẫn tiếp theo được xác nhận trực tiếp qua điện thoại hoặc Zalo." },
];

export function ServiceProcess() {
  return (
    <section className="mt-12 rounded-[28px] bg-slate-950 p-5 text-white sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-300">Quy trình đặt vé</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight">Gửi yêu cầu nhanh, xác nhận trực tiếp</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">Website tiếp nhận nhu cầu đặt vé và chuyển tới đội ngũ tư vấn. Vé chỉ được xác nhận sau khi nhân viên liên hệ lại.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => <article key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-5"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-400 text-sm font-black text-slate-950">{index + 1}</span><h3 className="mt-4 text-lg font-extrabold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p></article>)}
      </div>
    </section>
  );
}
