export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";


export async function GET(req: Request) {
    try {
        await adminGuard();

        const { searchParams } = new URL(req.url);

        const monitorId = searchParams.get("monitorId");

        if (!monitorId) {
            return NextResponse.json({
                success: false,
                message: "Monitor Id is required",
            }, {
                status: 400
            });
        }

        const availableDevices = await prisma.device.findMany({
            where: {
                monitors: {
                    none: {
                        monitorId: monitorId
                    }
                }
            },
            select: {
                id: true,
                serialNo: true,
            }
        });


        return NextResponse.json(availableDevices);

    } catch (error: any) {
        return handleAdminError(error);
    }
}