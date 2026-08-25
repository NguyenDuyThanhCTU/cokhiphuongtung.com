"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { contactFormSchema } from "@/features/content/schemas/contact.schema";
import { submitContactForm } from "@/features/content/services/contact.service";
import type { PublicSiteSettings } from "@/features/site/types";

type QuoteFormState = { fullName: string; phone: string; product: string; dimensions: string; location: string; note: string };
type SubmitStatus = { tone: "success" | "error"; message: string } | null;
const initialForm: QuoteFormState = { fullName: "", phone: "", product: "", dimensions: "", location: "", note: "" };
const fieldClass = "w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-mainColorHover";

function buildMessage(form: QuoteFormState) {
  return ["Nguồn form: Yêu cầu báo giá Cơ Khí Phương Tùng", `Sản phẩm/hạng mục: ${form.product}`, `Kích thước/số lượng: ${form.dimensions || "Chưa xác định"}`, `Địa điểm thi công: ${form.location || "Chưa xác định"}`, `Ghi chú: ${form.note || "Không có"}`].join("\n");
}

export default function QuoteRequestSection({ settings: _settings }: { settings: PublicSiteSettings }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>(null);

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get("san-pham")?.trim();
    if (product) setForm((current) => current.product ? current : { ...current, product });
  }, []);

  const update = (field: keyof QuoteFormState, value: string) => { setStatus(null); setForm((current) => ({ ...current, [field]: value })); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = contactFormSchema.safeParse({ fullName: form.fullName.trim(), phone: form.phone.trim(), email: "", message: buildMessage(form) });
    if (!form.product.trim()) { setStatus({ tone: "error", message: "Vui lòng nhập sản phẩm hoặc hạng mục cần báo giá." }); return; }
    if (!parsed.success) { setStatus({ tone: "error", message: parsed.error.issues[0]?.message || "Thông tin chưa hợp lệ." }); return; }
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(parsed.data);
      if (!result?.success) throw new Error("Request was not accepted");
      setForm(initialForm);
      setStatus({ tone: "success", message: "Đã tiếp nhận yêu cầu. Chúng tôi sẽ liên hệ để tư vấn và báo giá." });
    } catch {
      setStatus({ tone: "error", message: "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc gọi hotline." });
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-2xl border bg-white p-4" noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-normal">Tên (*)<input className={fieldClass} value={form.fullName} onChange={(event) => update("fullName", event.target.value)} placeholder="Nhập họ tên..." required /></label>
        <label className="font-normal">Số điện thoại (*)<input className={fieldClass} value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Nhập số điện thoại..." type="tel" required /></label>
        <label className="font-normal">Sản phẩm / hạng mục (*)<input className={fieldClass} value={form.product} onChange={(event) => update("product", event.target.value)} placeholder="Nhập sản phẩm cần báo giá..." required /></label>
        <div className="grid gap-2 d:grid-cols-2"><label>Kích thước / số lượng<input className={fieldClass} value={form.dimensions} onChange={(event) => update("dimensions", event.target.value)} /></label><label>Địa điểm thi công<input className={fieldClass} value={form.location} onChange={(event) => update("location", event.target.value)} /></label></div>
        <label className="font-normal">Nội dung<textarea className={`${fieldClass} min-h-28`} value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Chúng tôi có thể giúp gì cho bạn..." /></label>
        <p className="italic"><sup className="text-red-500">(*)</sup> bắt buộc phải nhập</p>
        {status ? <p role="status" className={status.tone === "success" ? "text-green-700" : "text-red-600"}>{status.message}</p> : null}
        <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-500 px-4 py-1 text-white duration-300 hover:bg-blue-600 disabled:opacity-60">{isSubmitting ? "Đang gửi..." : "Gửi Đi"}</button></div>
      </div>
    </form>
  );
}
