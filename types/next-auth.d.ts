import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR';
        } & DefaultSession["user"];
    }

    interface User {
        role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR';
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "WRITER" | "USER" | 'MONITOR';
        accessToken?: string;
    }
}
