import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get a single post
export async function GET(
    req: NextRequest,
    params: {
        params: Promise<{ blogId: string }>
    }) {
    try {

        const { blogId } = await params.params;

        if (!blogId) {
            return NextResponse.json({ message: "POST ID not found" }, { status: 403 });
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: blogId },
            select:{
                id: true,
                title: true,
                likedIds: true,
                desc: true,
                likesCount: true,
                createdAt: true,
                authorId: true,
                author: true,
                comments: true
            }
        });

        if (!post) {
            return NextResponse.json({ message: "Blog not found" }, { status: 403 });
        }

        return NextResponse.json(post);

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// Delete a Post
export async function DELETE(
    req: NextRequest,
    params: { params: Promise<{ blogId: string, username: string }> }
) {
    try {
        const { blogId, username } = await params.params;


        if (!blogId) {
            return NextResponse.json({ message: "POST ID not found" }, { status: 401 });
        }

        // TODO:: ADD AUTHENTICATION

        const post = await prisma.blogPost.findUnique({
            where: { id: blogId },
            select: { id: true, authorId: true },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }


        await prisma.$transaction([
            prisma.blogPostCategory.deleteMany({
                where: {
                    postId: post.id,
                },
            }),

            prisma.blogPost.delete({
                where: {
                    id: post.id,
                },
            }),
        ]);


        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE POST ERROR:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
