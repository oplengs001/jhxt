import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isInvoicesRoute = pathname.startsWith("/invoices");
  const isLoginPage = pathname === "/invoices/login";
  const isPortal = pathname.startsWith("/invoices/portal");
  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublicApi = pathname.startsWith("/api/public");

  // Protect /invoices and /api/invoices, /api/clients, /api/items
  if (isInvoicesRoute && !isLoginPage && !isPortal) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/invoices/login", request.url));
    }
  }

  // Protect /api/invoices, /api/documents, /api/items, and /api/clients (except public POST client creation)
  if (
    pathname.startsWith("/api/invoices") ||
    pathname.startsWith("/api/documents") ||
    pathname.startsWith("/api/items") ||
    (pathname.startsWith("/api/clients") && request.method !== "POST")
  ) {
    if (!sessionToken && !pathname.includes("/portal/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/invoices/:path*",
    "/api/invoices/:path*",
    "/api/clients/:path*",
    "/api/items/:path*",
    "/api/documents/:path*",
  ],
};
