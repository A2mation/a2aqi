export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleModeratorError } from "@/lib/handleRoleError";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.max(1, parseInt(searchParams.get("limit") || "7"));
        const skip = (page - 1) * limit;

        const whereCondition = {
            OR: [
                { serialNo: { contains: search, mode: 'insensitive' as const } },
                { name: { contains: search, mode: 'insensitive' as const } },
                { loaction: { contains: search, mode: 'insensitive' as const } },
            ],
        };

        const [devicesRaw, totalCount] = await Promise.all([
            prisma.device.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    name: true,
                    serialNo: true,
                    type: true,
                    status: true,
                    isActive: true,
                    lat: true,
                    lng: true,
                    loaction: true,
                    createdAt: true,
                    latestSensorReadings: {
                        select: {
                            aqi: true,
                            updatedAt: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.device.count({ where: whereCondition })
        ]);


        const devices = devicesRaw.map(device => {
            const lastSeen = device.latestSensorReadings?.updatedAt;
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            const isCurrentlyActive = lastSeen ? new Date(lastSeen) > fiveMinutesAgo : false;

            return {
                ...device,
                isActive: isCurrentlyActive,
                location: device.loaction,
            };
        });

        return NextResponse.json({
            success: true,
            devices,
            totalCount,
        });

    } catch (error: any) {
        console.error("[DEVICE_TABLE_GET_ERROR]", error);
        return handleModeratorError(error);
    }
}