import { ApiError } from "@/lib/api/api-error";

const fallbackMessage = "Không thể tải dữ liệu. Vui lòng thử lại.";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.message) {
    return error.message;
  }

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
