import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR' | 'MODERATOR';
        } & DefaultSession["user"];
    }

    interface User {
        role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR' | 'MODERATOR';
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR' | 'MODERATOR';
        accessToken?: string;
    }
}
