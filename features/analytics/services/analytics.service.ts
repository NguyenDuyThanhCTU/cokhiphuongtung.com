import { publicApiFetch } from "@/lib/api/public-api";
import { visitPayloadSchema, visitResponseSchema } from "@/features/analytics/schemas/analytics.schema";
import type { VisitPayload, VisitResponse } from "@/features/analytics/types";

export async function trackVisit(payload: VisitPayload = {}): Promise<VisitResponse> {
  const safePayload = visitPayloadSchema.parse(payload);
  const response = await publicApiFetch<unknown>("/api/public/analytics/visit", {
    method: "POST",
    body: safePayload,
    cache: "no-store",
  });

  return visitResponseSchema.parse(response);
}
