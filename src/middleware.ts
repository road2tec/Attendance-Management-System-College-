import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/student/attendance"];

  // Check if current path is public
  // We use startsWith for student/attendance to cover sub-paths if any, though exact match is safer for specific pages
  const isPublicPath = publicPaths.some(path => pathname === path || (path !== "/" && pathname.startsWith(path)));

  // If it's a static asset or API route, skip
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check for auth token (adjust cookie name if different, we used localStorage in context but middleware checks cookies usually)
  // Since we rely on Context/LocalStorage for this simple demo (as per AuthContext), middleware might be overkill or needs to match.
  // However, the provided AuthContext uses localStorage. Middleware cannot see localStorage.
  // Middleware can only see Cookies.

  // IF the previous developer set up cookies, we use them. 
  // But our new AuthContext uses localStorage('vidya_admin_user').

  // CRITICAL: Middleware cannot protect routes based on localStorage.
  // We already implemented client-side protection in `src/app/admin/layout.tsx`.
  // Therefore, we should RELAX the middleware to avoid conflicts/redirect loops.

  // We will mostly pass through, but if we want to support the previous cookie-based logic if it exists:
  const token = req.cookies.get("token")?.value;

  if (pathname.startsWith("/admin")) {
    // If we are strictly checking cookies
    // if (!token) {
    //    return NextResponse.redirect(new URL("/login", req.url));
    // }
    // But since we moved to client-side auth for the demo (localStorage), 
    // we let the client-side AdminLayout handle the redirect to login.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
