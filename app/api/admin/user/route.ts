import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";

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