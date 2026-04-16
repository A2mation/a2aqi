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
    if (
        pathname === "/admin/sign-in" ||
        pathname === "/admin-unauthorized" ||
        pathname === "/monitor/sign-in" ||
        pathname === "/moderator/sign-in"
    ) {
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

        if (pathname.startsWith("/monitor")) {
            return NextResponse.redirect(new URL("/monitor/sign-in", req.url));
        }

        if (pathname.startsWith("/moderator")) {
            return NextResponse.redirect(new URL("/moderator/sign-in", req.url));
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

    // MONITOR-only
    if (pathname.startsWith("/monitor") && token?.role !== ROLE.MONITOR) {
        return NextResponse.redirect(new URL("/monitor-unauthorized", req.url));
    }

    // MODERATOR-only
    if (pathname.startsWith("/moderator") && token?.role !== ROLE.MODERATOR) {
        return NextResponse.redirect(new URL("/moderator-unauthorized", req.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/blogs/write", "/admin/:path*", "/monitor/:path*",  "/moderator/:path*"]
}