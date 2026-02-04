import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLE } from "./types/type";

export async function proxy(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // Public admin sign-in
    if (pathname === "/admin/sign-in" || pathname === "/admin-unauthorized") {
        return NextResponse.next();
    }

    // Not authenticated
    if (!token) {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin/sign-in", req.url));
        }

        if (pathname.startsWith("/blogs/write")) {
            return NextResponse.redirect(new URL("/blogs/sign-in", req.url));
        }
    }

    // WRITER-only
    if (pathname.startsWith("/blogs/write") && token?.role !== ROLE.WRITER) {
        return NextResponse.redirect(new URL("/writer-unauthorized", req.url));
    }

    // ADMIN-only
    if (pathname.startsWith("/admin") && token?.role !== ROLE.ADMIN) {
        return NextResponse.redirect(new URL("/admin-unauthorized", req.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/blogs/write", "/admin/:path*"]
}