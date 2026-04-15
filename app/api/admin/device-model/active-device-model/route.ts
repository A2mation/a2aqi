import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {

        await adminGuard();


        const deviceModels = await prisma.deviceModel.findMany({
            where: {
                isActive: true
            }
        });


        const response = NextResponse.json(deviceModels);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;


    } catch (error: any) {
        return handleAdminError(error);
    }
}