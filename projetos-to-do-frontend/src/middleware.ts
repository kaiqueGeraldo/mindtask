import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = [
  { path: "/auth", whenAuthenticated: "redirect" },
  { path: "/esqueci-senha", whenAuthenticated: "next" },
  { path: "/aprovar-vinculo", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/auth";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => path.startsWith(route.path));
  const authToken = request.cookies.get("token")?.value;

  if (!authToken && publicRoute) return NextResponse.next();

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const hasVinculoToken = request.nextUrl.searchParams.get("vinculoToken");

    if (!hasVinculoToken) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (authToken) {
    try {
      const decoded = jwt.decode(authToken) as jwt.JwtPayload | null;
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(
          REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
        );
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
