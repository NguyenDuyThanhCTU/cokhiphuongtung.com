import { z } from "zod";

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên."),
  phone: z.string().trim().min(8, "Vui lòng nhập số điện thoại hợp lệ."),
  product: z.string().trim().min(1, "Vui lòng nhập sản phẩm hoặc hạng mục cần báo giá."),
  dimensions: z.string().trim().max(500).default(""),
  location: z.string().trim().max(500).default(""),
  note: z.string().trim().max(3000).default(""),
  sourceUrl: z.string().url().optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export function buildQuoteRequestMessage(input: QuoteRequestInput): string {
  return [
    "Nguồn form: Yêu cầu báo giá Cơ Khí Phương Tùng",
    `Sản phẩm/hạng mục: ${input.product}`,
    `Kích thước/số lượng: ${input.dimensions || "Chưa xác định"}`,
    `Địa điểm thi công: ${input.location || "Chưa xác định"}`,
    `Ghi chú: ${input.note || "Không có"}`,
  ].join("\n");
}
