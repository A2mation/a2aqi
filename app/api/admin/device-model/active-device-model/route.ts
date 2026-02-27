import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET() {
    try {

        await adminGuard();


        const deviceModels = await prisma.deviceModel.findMany({
            where: {
                isActive: true
            }
        });

        return NextResponse.json(deviceModels);


    } catch (error: any) {
        return handleAdminError(error);
    }
}