const benefits = [
  "Danh mục tuyến xe và vé xe được trình bày rõ ràng, dễ tìm kiếm.",
  "Giá vé tham khảo được hiển thị ngay khi dữ liệu đã được cập nhật.",
  "Form đặt vé gọn, chỉ thu thập những thông tin cần thiết để tư vấn.",
  "Hotline và Zalo luôn sẵn sàng cho nhu cầu cần hỗ trợ nhanh.",
  "Thông tin cuối cùng được nhân viên xác nhận trực tiếp với hành khách.",
  "Nội dung hướng dẫn và chính sách được cập nhật theo từng dịch vụ.",
];

export function ServiceBenefits() {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">Hỗ trợ đặt vé</p><h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Thông tin dễ hiểu, quy trình minh bạch</h2><p className="mt-3 text-sm leading-7 text-slate-600">Tìm hiểu tuyến xe, tham khảo giá và chủ động gửi yêu cầu trước khi trao đổi trực tiếp với nhân viên.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-800">✓</span><p className="text-sm leading-6 text-slate-700">{benefit}</p></div>)}
      </div>
    </section>
  );
}
