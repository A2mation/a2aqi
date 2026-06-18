import z from "zod";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";

const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function PATCH(req: Request) {

    try {

        const { admin } = await adminGuard();

        const body = await req.json();
        const validation = formSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(body.password, 10);

        const updatedAdmin = await prisma.admin.update({
            where: { id: admin.id, role: "ADMIN" },
            data: { password: hashedPassword },
            select: { id: true, email: true, name: true }
        });

        if (!updatedAdmin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Password updated successfully",
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}