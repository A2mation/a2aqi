import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET( req: Request) {
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

        const assignments = await prisma.monitorDevice.findMany({
            where: {
                monitorId: monitorId
            },
            select: {
                device :{
                    select: {
                        id: true,
                        serialNo: true,
                        model: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        const assignedDevices = assignments.map(a => a.device);
        
        return NextResponse.json(assignedDevices).headers.set('Cache-Control', 'no-store, max-age=0');

    } catch (error: any) {
        return handleAdminError(error);
    }
}