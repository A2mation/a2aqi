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
    password: z.string().min(6).optional().or(z.literal("")),
});


export async function GET(
    req: Request,
    { params }: { params: Promise<{ moderatorId: string }> }
) {
    try {
        await adminGuard();
        const { moderatorId } = await params;

        if (!moderatorId) {
            return new NextResponse("Moderator ID is required", { status: 400 });
        }

        const moderator = await prisma.admin.findUnique({
            where: {
                id: moderatorId,
                role: AdminRole.MODERATOR
            },
            include: {
                _count: {
                    select: { calibrations: true }
                }
            }
        });

        if (!moderator) {
            return new NextResponse("Moderator not found", { status: 404 });
        }

        const { password, ...moderatorData } = moderator;

        return NextResponse.json({
            ...moderatorData,
            calibrationCount: moderator._count.calibrations
        });

    } catch (err: any) {
        return handleAdminError(err);
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ moderatorId: string }> }
): Promise<NextResponse> {
    try {
        await adminGuard();
        const { moderatorId } = await params;

        if (!moderatorId) {
            return new NextResponse("Moderator ID not found", { status: 400 });
        }

        const body = await req.json();
        const validation = ModeratorSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;


        if (email) {
            const existingEmail = await prisma.admin.findFirst({
                where: {
                    email,
                    NOT: { id: moderatorId }
                },
                select: { id: true }
            });

            if (existingEmail) {
                return NextResponse.json(
                    { message: "This email is already in use." },
                    { status: 409 }
                );
            }
        }

        const updateData: any = {
            name,
            email,
        };

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const updatedModerator = await prisma.admin.update({
            where: {
                id: moderatorId,
                role: AdminRole.MODERATOR
            },
            data: updateData,
        });

        const { password: _, ...moderatorWithoutPassword } = updatedModerator;
        return NextResponse.json(moderatorWithoutPassword);

    } catch (err: any) {
        return handleAdminError(err);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ moderatorId: string }> }
) {
    try {
        await adminGuard();
        const { moderatorId } = await params;

        if (!moderatorId) {
            return new NextResponse("Moderator ID is required", { status: 400 });
        }

        const target = await prisma.admin.findUnique({
            where: { id: moderatorId }
        });

        if (target?.role !== AdminRole.MODERATOR) {
            return new NextResponse("Unauthorized: Cannot delete non-moderator accounts here", { status: 403 });
        }

        /**
         * Transactional Delete: 
         * Clean up relations if your schema requires it, then delete admin.
         */
        await prisma.$transaction([
            prisma.calibration.deleteMany({
                where: { performedById: moderatorId }
            }),
            prisma.admin.delete({
                where: { id: moderatorId }
            })
        ]);

        return new NextResponse("Moderator deleted successfully", { status: 200 });

    } catch (err: any) {
        if (err.code === 'P2025') {
            return new NextResponse("Moderator not found", { status: 404 });
        }
        return handleAdminError(err);
    }
}