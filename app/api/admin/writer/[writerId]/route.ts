import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ContentWriterStatus } from "@prisma/client";

import { ROLE } from "@/types/type";
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth";

export async function PATCH(
    req: Request,
    params: {
        params: Promise<{ writerId: string }>
    }
) {
    try {

        const { writerId } = await params.params;

        if (!writerId) {
            return new NextResponse("Writer ID not Found", {
                status: 400
            })
        }

        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.ADMIN) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const verifyAdmin = await prisma.admin.findUnique({
            where: {
                id: session.user.id
            }
        })

        if (!verifyAdmin) {
            return new NextResponse("Admin authentication failed", { status: 401 })
        }

        const {
            name,
            email,
            password,
            status,
        } = await req.json();

        const data: {
            name: string,
            email: string,
            status: ContentWriterStatus
            password?: string
        } = {
            name,
            email,
            status,
        };

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const writer = await prisma.contentWriter.update({
            where: { id: writerId },
            data,
        });

        return NextResponse.json(writer, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ writerId: string }>
    }
) {
    try {
        const { writerId } = await params.params;

        if (!writerId) {
            return new NextResponse(
                "Writer ID not found",
                { status: 400 }
            );
        }

        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.ADMIN) {
            return new NextResponse(
                "Unauthorized",
                { status: 401 }
            );
        }

        const verifyAdmin = await prisma.admin.findUnique({
            where: { id: session.user.id }
        });

        if (!verifyAdmin) {
            return new NextResponse(
                "Admin authentication failed",
                { status: 401 }
            );
        }

        const blogCount = await prisma.blogPost.count({
            where: { authorId: writerId }
        });

        if (blogCount > 0) {
            return new NextResponse(
                "Delete all blogs written by this writer first",
                { status: 409 }
            );
        }

        const deletedWriter = await prisma.contentWriter.delete({
            where: { id: writerId }
        });

        return NextResponse.json(
            { message: "Writer deleted successfully", data: deletedWriter },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return new NextResponse(
            "Internal Server Error",
            { status: 500 }
        );
    }
}
