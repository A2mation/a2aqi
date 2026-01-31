import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { http } from "@/lib/http";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Credentials({
            id: "admin",
            name: "Admin Login",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const res = await http.post("/api/admin/login", credentials);
                    return normalizeUser(res.data, "ADMIN");
                } catch (error) {
                    console.error("Admin login failed:", error);
                    return null;
                }
            },
        }),

        Credentials({
            id: "writer",
            name: "Writer Login",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const res = await http.post("api/blog/auth/login", credentials);
                    return res.data;
                } catch (error) {
                    console.error("Writer login failed:", error);
                    return null;
                }
            },
        }),

        Credentials({
            id: "user",
            name: "User Login",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const res = await http.post("/api/user/login", credentials);
                    return normalizeUser(res.data, "USER");
                } catch (error) {
                    console.error("User login failed:", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.accessToken = token.accessToken as string;
            return session;
        },

        async signIn({ user }) {
            if (user) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
