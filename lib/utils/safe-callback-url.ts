export function safeCallbackUrl(value: string | null | undefined, fallback: string = "/"): string {
  if (!value || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://public.local");
    if (url.origin !== "https://public.local") {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
