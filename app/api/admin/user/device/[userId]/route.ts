import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";


export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {

        await adminGuard();

        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }


        const devices = await prisma.device.findMany({
            where: {
                userId: userId
            },
            include: {
                model: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(devices);
    } catch (error) {
        return handleAdminError(error);
    }
}