import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ContentWriterStatus } from "@prisma/client";

import { ROLE } from "@/types/type";
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.ADMIN) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            name,
            email,
            username,
            password,
            status,
        } = await req.json();

        if (!name || !email || !username || !password) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        const emailExists = await prisma.contentWriter.findUnique({
            where: { email },
            select: { email: true },
        });

        if (emailExists) {
            return new NextResponse("Email already exists", { status: 409 });
        }

        const usernameExists = await prisma.contentWriter.findUnique({
            where: { username },
            select: { username: true },
        });

        if (usernameExists) {
            return new NextResponse("Username already exists", { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const writer = await prisma.contentWriter.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                status: status ?? ContentWriterStatus.ACTIVE,
            },
        });

        return NextResponse.json(writer, { status: 201 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

