import { handleFrontendRevalidationRequest } from "@/lib/frontend-revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFrontendRevalidationRequest(request);
}
