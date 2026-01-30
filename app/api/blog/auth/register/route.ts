import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ContentWriterStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

const TOKEN_NAME = process.env.WRITTER_TOKEN!;

export async function POST(req: Request) {
    return NextResponse.json(
        { message: "This Route is Closed contact admin" },
        { status: 401 }
    );
    try {
        const { name, username, email, password } = await req.json();

        if (!name || !username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const existingWriter = await prisma.contentWriter.findUnique({
            where: { email },
        });

        if (existingWriter) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const writer = await prisma.contentWriter.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                status: ContentWriterStatus.ACTIVE,
            },
        });

        const token = signToken(
            writer.id,
            writer.email,
            writer.status
        );

        const response = NextResponse.json(
            {
                message: "Registration successful",
                writer: {
                    id: writer.id,
                    name: writer.name,
                    email: writer.email,
                    status: writer.status,
                },
            },
            { status: 201 }
        );

        response.cookies.set(TOKEN_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        // console.error("REGISTER ERROR:", error);
        return new NextResponse(
            "Internal server error",
            { status: 500 }
        );
    }
}
