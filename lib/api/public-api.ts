import { ApiError } from "@/lib/api/api-error";
import { getPublicEnv } from "@/lib/config/env";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type PublicFetchOptions = {
  method?: HttpMethod;
  body?: unknown;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

function buildUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

async function readError(
  response: Response,
  fallback: string,
): Promise<ApiError> {
  try {
    const payload = (await response.json()) as unknown;
    if (
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
    ) {
      return new ApiError(payload.message, response.status);
    }
  } catch {
    return new ApiError(fallback, response.status);
  }

  return new ApiError(fallback, response.status);
}

export async function publicApiFetch<T>(
  path: string,
  options: PublicFetchOptions = {},
): Promise<T> {
  const publicEnv = getPublicEnv();
  const response = await fetch(
    buildUrl(publicEnv.NEXT_PUBLIC_API_BASE_URL, path),
    {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        "x-public-site-key": publicEnv.NEXT_PUBLIC_SITE_KEY,
      },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      next: options.next,
      cache:
        process.env.NODE_ENV === "development" ? "no-cache" : options.cache,
    },
  );

  if (!response.ok) {
    throw await readError(response, "Public API request failed.");
  }

  return response.json() as Promise<T>;
}
