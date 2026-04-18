export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleModeratorError } from "@/lib/handleRoleError";
import { moderatorGuard } from "@/lib/moderatorAuth";


export async function GET() {
    try {

        await moderatorGuard();


        const deviceModels = await prisma.deviceModel.findMany({
            where: {
                isActive: true
            }, select: {
                id: true,
                name: true
            }
        });

        const response = NextResponse.json(deviceModels);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;


    } catch (error: any) {
        return handleModeratorError(error);
    }
}