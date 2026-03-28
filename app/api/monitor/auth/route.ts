import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const monitor = await prisma.monitor.findUnique({
            where: { email },
        });

        if (!monitor) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, monitor.password);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }


        const token = signToken(monitor.id, monitor.email, monitor.status);

        return NextResponse.json({
            id: monitor.id,
            name: monitor.name,
            email: monitor.email,
            role: "MONITOR",
            accessToken: token,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
