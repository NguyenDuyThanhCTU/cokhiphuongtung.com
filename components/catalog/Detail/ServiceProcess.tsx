const processSteps = [
  { title: "Chọn mẫu phù hợp", description: "Tham khảo sản phẩm, thông số và các hạng mục Phương Tùng đang thực hiện." },
  { title: "Gửi yêu cầu", description: "Cung cấp kích thước, địa điểm, hình ảnh tham khảo và số điện thoại." },
  { title: "Tư vấn & khảo sát", description: "Đội ngũ kỹ thuật làm rõ vật liệu, thiết kế và điều kiện thi công." },
  { title: "Báo giá & triển khai", description: "Phương án, chi phí và tiến độ được thống nhất trước khi gia công." },
];

export function ServiceProcess() {
  return (
    <section className="mt-12 rounded-[28px] bg-slate-950 p-5 text-white sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-300">Quy trình thực hiện</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight">Rõ ràng từ yêu cầu đến lắp đặt</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">Mỗi công trình được trao đổi cụ thể về thiết kế, vật liệu, chi phí và tiến độ trước khi triển khai.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => <article key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-5"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-400 text-sm font-black text-slate-950">{index + 1}</span><h3 className="mt-4 text-lg font-extrabold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p></article>)}
      </div>
    </section>
  );
}
