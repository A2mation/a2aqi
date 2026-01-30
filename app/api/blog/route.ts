import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ContentWriterStatus } from "@prisma/client";

import { Category } from "@/store/category.store";
import { getAuthSession } from "@/auth";
import { BLOG_POST_PER_PAGE } from "@/constant/blog-per-page";


export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);

        const cat = searchParams.get("cat");
        const page = Number(searchParams.get("page") ?? 1);

        const session = await getAuthSession();

        const where = cat
            ? {
                categories: {
                    some: {
                        category: {
                            slug: cat,
                        },
                    },
                },
            }
            : {};
        

        const [posts, total] = await prisma.$transaction([
            prisma.blogPost.findMany({
                skip: BLOG_POST_PER_PAGE * (Number(page) - 1),
                take: BLOG_POST_PER_PAGE as number,
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        },
                    },
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                },
            }),

            prisma.blogPost.count({ where }),
        ]);
        // console.log("Length"+posts.length)


        return NextResponse.json({
            page,
            total,
            posts,
            viewer: session?.user?.role ?? "PUBLIC",
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "WRITER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (
            session.user.status &&
            session.user.status !== ContentWriterStatus.ACTIVE
        ) {
            return NextResponse.json(
                { message: "Account not active" },
                { status: 403 }
            );
        }

        const writer = await prisma.contentWriter.findUnique({
            where: { email: session.user.email },
        });

        if (!writer) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, blog, img, tags } = await req.json();

        if (!title || !blog || !tags?.length) {
            return NextResponse.json(
                { message: "Title, blog and tags are required" },
                { status: 400 }
            );
        }

        const categoryIds = tags.map((cat: Category) => cat.id);

        const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true },
        });

        if (!categories.length) {
            return NextResponse.json(
                { message: "Invalid categories" },
                { status: 400 }
            );
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                desc: blog,
                img,
                authorId: writer.id,
                categories: {
                    create: categories.map((cat) => ({
                        category: {
                            connect: { id: cat.id },
                        },
                    })),
                },
            },
        });

        return NextResponse.json(
            {
                message: "Blog post created successfully",
                post,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE POST ERROR:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

