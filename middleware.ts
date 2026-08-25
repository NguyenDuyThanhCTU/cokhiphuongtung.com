import { NextRequest, NextResponse } from "next/server";

type PublicRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
  statusCode: 301 | 302;
};

type PublicRedirectResponse = {
  success: boolean;
  data?: {
    redirect?: PublicRedirect | null;
  };
};

// Configure these server-side environment variables in the frontend project:
// PUBLIC_API_BASE_URL=https://api.dnaagency.com.vn

const PUBLIC_API_BASE_URL = (
  process.env.PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
).replace(/\/+$/, "");
const PUBLIC_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY?.trim() || "";

function isSameDestination(request: NextRequest, destination: URL) {
  return (
    destination.origin === request.nextUrl.origin &&
    destination.pathname === request.nextUrl.pathname &&
    destination.search === request.nextUrl.search
  );
}

export async function middleware(request: NextRequest) {
  // Keep the website available if its SAAS environment variables are not ready.
  if (!PUBLIC_API_BASE_URL || !PUBLIC_SITE_KEY) return NextResponse.next();

  try {
    const lookupUrl = new URL("/api/public/redirects", PUBLIC_API_BASE_URL);
    lookupUrl.searchParams.set("path", request.nextUrl.pathname);

    const response = await fetch(lookupUrl, {
      method: "GET",
      headers: {
        "x-public-site-key": PUBLIC_SITE_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) return NextResponse.next();

    const payload = (await response.json()) as PublicRedirectResponse;
    const rule = payload.success ? payload.data?.redirect : null;
    if (!rule?.destination) return NextResponse.next();

    const destination = new URL(rule.destination, request.url);

    // Preserve the original query string when the configured destination
    // does not define its own query string.
    if (!destination.search && request.nextUrl.search) {
      destination.search = request.nextUrl.search;
    }

    if (isSameDestination(request, destination)) return NextResponse.next();

    return NextResponse.redirect(destination, rule.permanent ? 301 : 302);
  } catch {
    // A redirect lookup must never make the public website unavailable.
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
