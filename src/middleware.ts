// version1
// author Yxff
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

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

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/accompaniments/:path*",
    "/api/teachers/:path*",
    "/api/subjects/:path*",
  ],
}