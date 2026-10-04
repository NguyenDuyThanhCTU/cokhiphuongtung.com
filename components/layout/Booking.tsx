"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { quoteRequestSchema } from "@/features/content/schemas/quote-request.schema";
import { submitQuoteRequest } from "@/features/content/services/quote-request.service";

type QuoteFormState = { fullName: string; phone: string; product: string; dimensions: string; location: string; note: string };
const initialForm: QuoteFormState = { fullName: "", phone: "", product: "", dimensions: "", location: "", note: "" };
const fieldClass = "w-full border border-gray-300 bg-white px-3 py-2 outline-none focus:border-mainColorHover";

export default function QuoteRequestSection() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const product = new URLSearchParams(window.location.search).get("san-pham")?.trim();
    if (product) setForm((current) => current.product ? current : { ...current, product });
  }, []);

  const update = (field: keyof QuoteFormState, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = quoteRequestSchema.safeParse({
      ...form,
      sourceUrl: window.location.href,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Thông tin chưa hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Đang gửi yêu cầu báo giá...");
    try {
      const result = await submitQuoteRequest(parsed.data);
      setForm(initialForm);
      toast.update(toastId, {
        render: result.message,
        type: result.emailSent ? "success" : "warning",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error instanceof Error ? error.message : "Chưa thể gửi yêu cầu. Vui lòng thử lại hoặc gọi hotline.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
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
        <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-500 px-4 py-1 text-white duration-300 hover:bg-blue-600 disabled:opacity-60">{isSubmitting ? "Đang gửi..." : "Gửi Đi"}</button></div>
      </div>
      <ToastContainer position="top-right" newestOnTop theme="colored" />
    </form>
  );
}
