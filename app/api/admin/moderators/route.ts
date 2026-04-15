export const dynamic = 'force-dynamic';
export const revalidate = 0;


import * as z from "zod";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { AdminRole } from "@prisma/client";

const ModeratorSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6).optional(),
});


export async function GET() {
    try {
        await adminGuard();

        const moderators = await prisma.admin.findMany({
            where: {
                role: AdminRole.MODERATOR
            },
            include: {
                _count: {
                    select: { calibrations: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedModerators = moderators.map((mod) => {
            const { password, ...rest } = mod;
            return {
                ...rest,
                calibrationCount: mod._count.calibrations,
            };
        });

        return NextResponse.json(formattedModerators);

    } catch (error: any) {
        return handleAdminError(error);
    }
}

export async function POST(request: Request) {
    try {
        await adminGuard();

        const body = await request.json();
        const validation = ModeratorSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Validation Error",
                    errors: validation.error
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        if (!password) {
            return new NextResponse("Password is required for new moderators", { status: 400 });
        }

        // Check if email exists across all Admins
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newModerator = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: AdminRole.MODERATOR
            }
        });

        const { password: _, ...moderatorWithoutPassword } = newModerator;

        return NextResponse.json(moderatorWithoutPassword, { status: 201 });

    } catch (error: any) {
        return handleAdminError(error);
    }
}