import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AccountType, AuthProvider } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { http } from "@/lib/http";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    pages: {
        signIn: "/user/sign-in",
    },

    providers: [
        // GOOGLE PROVIDER
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // 🔐 ADMIN
        Credentials({
            id: "admin",
            name: "Admin Login",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                // console.log("ADMIN LOGIN ATTEMPT", credentials?.email, credentials?.password);
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const res = await http.post("api/admin/auth/sign-in", credentials);
                    console.log(res)
                    return res.data;
                } catch (error) {
                    console.error("Admin login failed:", error);
                    return null;
                }
            },
        }),

        // ✍️ WRITER
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

        // 👤 USER
        Credentials({
            id: "user",
            name: "User Login",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const res = await http.post("/api/user/auth/login", credentials);
                    // console.log(res)
                    if (res.status !== 200) {
                        throw new Error(res.data?.message || "Login failed");
                    }
                    return res.data;
                } catch (error: any) {
                    throw new Error(
                        error || "Invalid email or password"
                    );
                }
            },
        }),
    ],

    callbacks: {

        async signIn({ user, account }) {
            if (account?.provider === "google") {

                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    // Create new Google user with USER role
                    const newUser = await prisma.user.create({
                        data: {
                            name: user.name!,
                            email: user.email!,
                            authProvider: AuthProvider.GOOGLE,
                            accountType: AccountType.PERSONAL,
                        },
                    });

                    user.id = newUser.id;
                    user.role = "USER";
                } else {
                    // Ensure role is USER even if existing
                    user.id = existingUser.id;
                    user.role = "USER";
                }
            }

            return true;
        },

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

    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
