const benefits = [
  "Mẫu và thông tin sản phẩm được trình bày rõ ràng, dễ tham khảo.",
  "Vật liệu và kích thước được tư vấn theo nhu cầu thực tế.",
  "Form báo giá gọn, chỉ thu thập những thông tin cần thiết.",
  "Hotline và Zalo sẵn sàng tiếp nhận hình ảnh công trình.",
  "Phương án và chi phí được trao đổi trước khi triển khai.",
  "Chính sách bảo hành được áp dụng theo từng hạng mục.",
];

export function ServiceBenefits() {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">Cam kết dịch vụ</p><h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Thông tin rõ ràng, quy trình minh bạch</h2><p className="mt-3 text-sm leading-7 text-slate-600">Tham khảo mẫu, gửi nhu cầu và trao đổi trực tiếp với đội ngũ kỹ thuật trước khi quyết định.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-800">✓</span><p className="text-sm leading-6 text-slate-700">{benefit}</p></div>)}
      </div>
    </section>
  );
}
