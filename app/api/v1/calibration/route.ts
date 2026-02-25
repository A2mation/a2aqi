import { authenticateSensor } from "@/domains/sensors/sensor.auth";
import { SensorError } from "@/domains/sensors/sensor.error";
import { prisma } from "@/lib/prisma";
import { CalibrationValues } from "@/types/type";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }

        const { serialNo, ack }: { serialNo: string; ack?: number } = await req.json();

        if (!serialNo) {
            throw new SensorError("Serial No. not found", 404);
        }

        const device = await authenticateSensor(serialNo, apiKey);

        
        // Get latest PENDING calibration
        const calibration = await prisma.calibration.findFirst({
            where: {
                deviceId: device.id,
                status: "PENDING",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        
        // No pending calibration
        if (!calibration) {
            return new NextResponse(null, { status: 204 });
        }
        
        const now = new Date();
        
        // Expiry check (self-cleaning, no cron)
        if (calibration.expiresAt && calibration.expiresAt < now) {
            await prisma.calibration.updateMany({
                where: {
                    id: calibration.id,
                    status: "PENDING",
                },
                data: {
                    status: "FAILED",
                },
            });
            
            await redis.del(`calibration:${device.id}`);
            
            return new NextResponse(null, { status: 204 });
        }
        
        // ACK Handling (Race-Safe & Idempotent)
        if (ack === 1) {
            const result = await prisma.calibration.updateMany({
                where: {
                    id: calibration.id,
                    status: "PENDING",
                },
                data: {
                    status: "SUCCESS",
                    acknowledgedAt: new Date(),
                },
            });
            
            // Only first valid ACK deletes Redis
            if (result.count === 1) {
                await redis.del(`calibration:${device.id}`);
            }
            
            return NextResponse.json(
                { success: true },
                { status: 200 }
            );
        }
        
        // Fetch calibration from Redis
        const cachedCalibration: any = await redis.get(
            `calibration:${device.id}`
        );
        
        if (!cachedCalibration) {
            return new NextResponse(null, { status: 204 });
        }
        
        // Mark as delivered (only once)
        if (!calibration.deliveredAt) {
            await prisma.calibration.updateMany({
                where: {
                    id: calibration.id,
                    deliveredAt: null,
                },
                data: {
                    deliveredAt: new Date(),
                },
            });
        }
        
        
        console.log(cachedCalibration)

        return NextResponse.json(
            {
                success: true,
                calibration: cachedCalibration,
            },
            {
                status: 200
            }
        );
    } catch (err: unknown) {
        if (err instanceof SensorError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}