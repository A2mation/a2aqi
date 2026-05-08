export const dynamic = 'force-dynamic';
export const revalidate = 0;


import { hash } from "bcryptjs"
import { NextResponse } from "next/server";
import { AccountType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { UserFormSchema } from "@/lib/validation/admin/User";


export async function GET(req: Request) {
    try {
        await adminGuard();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const search = searchParams.get("search") || "";
        const limit = 10;


        const users = await prisma.user.findMany({
            take: limit,
            // Skip the cursor element if we are fetching the next page
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: {
                // Only apply search filter if search string is not empty
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ] : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });


        const nextCursor = users.length === limit ? users[users.length - 1].id : null;

        return NextResponse.json({
            users: users || [],
            nextCursor
        });

    } catch (error) {
        console.error("User Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await adminGuard();
        
        const body = await req.json();
        const validation = UserFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error },
                { status: 400 }
            );
        }

        const { name, email, password, accountType, status, organizationName, gstNumber } = validation.data;

        if (!name || !email || !password || !accountType) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            return new NextResponse("User already exists", { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                accountType,
                status,
                ...(accountType === AccountType.ORGANIZATION && {
                    organizationName,
                    gstNumber,
                }),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USERS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}