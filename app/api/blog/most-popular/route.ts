import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: {
                likesCount: {
                    gt: 0,
                },
            },
            orderBy: {
                likesCount: "desc"
            },
            take: 3,
            select: {
                id: true,
                title: true,
                author: true,
                img: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            posts,
        });
    } catch (error) {
        return new NextResponse(
            "Internal server error",
            { status: 500 }
        );
    }
}
