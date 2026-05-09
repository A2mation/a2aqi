import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { Category, ContentWriterStatus } from "@prisma/client";
import { getAuthSession } from "@/auth";

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
            select: {
                id: true,
                title: true,
                likedIds: true,
                img: true,
                desc: true,
                likesCount: true,
                createdAt: true,
                authorId: true,
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                slug: true,
                                title: true,
                                description: true
                            }
                        }
                    }
                },
                author: true,
                comments: true
            }
        });


        if (!post) {
            return NextResponse.json({ message: "Blog not found" }, { status: 403 });
        }

        const flattenedBlog = {
            ...post,
            categories: post.categories.map((c) => c.category)
        };
        return NextResponse.json(flattenedBlog);

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

export async function PATCH(req: NextRequest,
    params: {
        params: Promise<{ blogId: string }>
    }
) {
    try {

        const { blogId } = await params.params;

        if (!blogId) {
            return NextResponse.json({ message: "POST ID not found" }, { status: 403 });
        }

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

        // Delete the Previous image and Update the new one
        const existingBlog = await prisma.blogPost.findUnique({
            where: { id: blogId },
            select: { img: true }
        });

        const isNewUpload = img && !img.includes("res.cloudinary.com");
        if (isNewUpload) {
            // A. Delete the old image
            if (existingBlog?.img) {
                // Extract public_id from the URL
                // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v12345/[folder]/[id].jpg
                const parts = existingBlog.img.split('/');
                const lastPart = parts.pop(); // e.g., "sample.jpg"
                const folderPart = parts.pop(); // e.g., "blog_banner_images"
                const publicId = `${folderPart}/${lastPart?.split('.')[0]}`;

                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.error("Cloudinary Delete Error:", error);
                }
            }
        }

        const uploadResponse = await cloudinary.uploader.upload(img, {
            folder: 'blog_banner_images',
        });

        const post = await prisma.blogPost.update({
            where: {
                id: blogId
            },
            data: {
                title,
                desc: blog,
                img: uploadResponse.secure_url,
                authorId: writer.id,
                categories: {
                    //Wipe the current connections for this post
                    deleteMany: {},
                    // Re-create them using the categories found earlier
                    create: categories.map((cat) => ({
                        category: {
                            connect: { id: cat.id }
                        }
                    })),
                },
            },
        });

        return NextResponse.json(
            {
                message: "Blog post updated successfully",
                post,
            },
            { status: 200 }
        );


    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}