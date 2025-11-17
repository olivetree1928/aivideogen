import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: routing.locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: routing.defaultLocale,

  // Redirect to default locale if no locale is detected
  localePrefix: "as-needed",

  // Disable locale detection
  localeDetection: false,
});

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Enforce canonical domain: redirect www.imaginevisual.cc -> imaginevisual.cc
  if (host.startsWith("www.imaginevisual.cc")) {
    const url = req.nextUrl.clone();
    url.hostname = "imaginevisual.cc";
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  // Skip i18n middleware for API/_next/_vercel/static assets
  const pathname = req.nextUrl.pathname;
  const isExcluded =
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    /\.[^/]+$/.test(pathname); // files with extension

  if (isExcluded) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Run on all paths so domain redirect also applies to /api callbacks
  matcher: ["/:path*"],
};