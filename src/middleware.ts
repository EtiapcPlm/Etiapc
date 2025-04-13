// version1
// author Yxff
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Definir las rutas permitidas por rol
const roleRoutes = {
  teacher: ["/dashboard"],
  coordinator: ["/dashboard"],
  administrator: ["/dashboard"]
};

// Función de logging para producción
const logAccess = (message: string, metadata?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[Middleware] ${message}`, metadata || '');
  }
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Si el usuario está autenticado y trata de acceder a /auth/login, redirigir al dashboard
    if (token && pathname.startsWith("/auth/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Si el usuario está autenticado y trata de acceder a /dashboard/overview, redirigir al dashboard principal
    if (token && pathname === "/dashboard/overview") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Si la ruta es /auth/login, permitir acceso sin token
        if (req.nextUrl.pathname.startsWith("/auth/login")) {
          return true;
        }
        // Para otras rutas protegidas, requerir token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/api/:path*"
  ],
};