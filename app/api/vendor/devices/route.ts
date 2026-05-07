import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { vendorGuard } from "@/lib/vendorAuth";

/**
 * Get all devices added by the registered Vendor
 * 
 *  @param req 
 */
export async function GET(req: Request) {
    try {
        const { vendor } = await vendorGuard();
        
        const devicesRaw = await prisma.device.findMany({
            where: { createdById: vendor.id },
            select: {
                id: true,
                name: true,
                serialNo: true,
                apiKey: true,
                type: true,
                loaction: true,
                lat: true,
                lng: true,
                status: true,
                model: {
                    select: {
                        name: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                latestSensorReadings: {
                    select: {
                        measuredAt: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const now = new Date();
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

        const devices = devicesRaw.map(device => {
            const latestReading = device.latestSensorReadings;

            const isActive = latestReading
                ? (now.getTime() - new Date(latestReading.measuredAt).getTime()) <= FIVE_MINUTES_IN_MS
                : false;

            return {
                id: device.id,
                name: device.name,
                serialNo: device.serialNo,
                isActive: isActive,
                apiKey: device.apiKey,
                type: device.type,
                location: device.loaction,
                lat: device.lat,
                lng: device.lng,
                status: device.status,
                model: device.model,
                user: device.user,
                createdAt: device.createdAt
            };
        });

        return NextResponse.json(
            devices,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}