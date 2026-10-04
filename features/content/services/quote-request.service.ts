import type { QuoteRequestInput } from "@/features/content/schemas/quote-request.schema";

export type QuoteRequestResult = {
  success: boolean;
  emailSent: boolean;
  message: string;
};

export async function submitQuoteRequest(
  input: QuoteRequestInput,
): Promise<QuoteRequestResult> {
  const response = await fetch("/api/quote-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = (await response.json().catch(() => ({
    success: false,
    emailSent: false,
    message: "Phản hồi từ máy chủ không hợp lệ.",
  }))) as QuoteRequestResult;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Chưa thể gửi yêu cầu báo giá.");
  }

  return result;
}
