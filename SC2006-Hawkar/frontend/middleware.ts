import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/sign-up"

  // Get the user session from cookies
  const userId = request.cookies.get("userId")?.value
  const userDataCookie = request.cookies.get("userData")?.value

  // If no session and trying to access a protected route, redirect to login
  if (!userId && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If logged in and trying to access login/signup, redirect to appropriate dashboard
  if (userId && isPublicPath) {
    try {
      const userData = userDataCookie ? JSON.parse(userDataCookie) : null
      const role = userData?.role

      if (role === "Consumer") {
        return NextResponse.redirect(new URL("/", request.url))
      } else if (role === "Hawker") {
        return NextResponse.redirect(new URL("/hawker", request.url))
      } else if (role === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      // Default fallback if role is not recognized
      return NextResponse.redirect(new URL("/", request.url))
    } catch (error) {
      // If there's an error parsing the userData, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Check role-based access for protected routes
  if (userId && !isPublicPath) {
    try {
      const userData = userDataCookie ? JSON.parse(userDataCookie) : null
      const role = userData?.role

      // Protect hawker routes
      if (path.startsWith("/hawker") && role !== "Hawker") {
        if (role === "Consumer") {
          return NextResponse.redirect(new URL("/", request.url))
        } else if (role === "Admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Protect admin routes
      if (path.startsWith("/admin") && role !== "Admin") {
        if (role === "Consumer") {
          return NextResponse.redirect(new URL("/", request.url))
        } else if (role === "Hawker") {
          return NextResponse.redirect(new URL("/hawker", request.url))
        }
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Protect consumer routes (root path)
      if (path === "/" && role !== "Consumer") {
        if (role === "Hawker") {
          return NextResponse.redirect(new URL("/hawker", request.url))
        } else if (role === "Admin") {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      }
    } catch (error) {
      // If there's an error parsing the userData, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/", "/login", "/sign-up", "/hawker/:path*", "/admin/:path*", "/stall/:path*"],
}