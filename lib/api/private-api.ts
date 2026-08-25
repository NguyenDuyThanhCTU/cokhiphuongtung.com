import { ApiError } from "@/lib/api/api-error";
import { getPublicEnv } from "@/lib/config/env";
import type { HttpMethod } from "@/lib/api/public-api";

export type PrivateFetchOptions = {
  method?: HttpMethod;
  body?: unknown;
  token: string;
  cache?: RequestCache;
};

function buildUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

export async function privateApiFetch<T>(
  path: string,
  options: PrivateFetchOptions,
): Promise<T> {
  const publicEnv = getPublicEnv();
  const response = await fetch(buildUrl(publicEnv.NEXT_PUBLIC_API_BASE_URL, path), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    throw new ApiError("Private API request failed.", response.status);
  }

  return response.json() as Promise<T>;
}
