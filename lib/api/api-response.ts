import type { ApiResponse } from "@/lib/types/api";

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}
