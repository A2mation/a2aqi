import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth";

export async function GET(
    req: Request
) {
    try {

        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get('blogId')

        if (!blogId) {
            return new NextResponse("Blog Id not exist", {
                status: 404
            })
        }

        const comment = await prisma.comment.findMany({
            where: {
                postId: blogId
            }, include: {
                author: true
            }
        })

        return NextResponse.json(comment, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    req: Request
) {
    try {

        const session = await getAuthSession();

        if (!session) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

        const verifiedUser = await prisma.contentWriter.findFirst({
            where: {
                id: session.user.id
            }
        })

        if (!verifiedUser) {
            return new NextResponse("Id not Found", {
                status: 401
            })
        }

        const {
            comments,
            postId
        } = await req.json();


        const res = await prisma.comment.create({
            data: {
                desc: comments,
                postId: postId,
                authorId: session.user.id
            }
        })

        return NextResponse.json(res, {
            status: 200
        })

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}