import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

const CacheKey = `user:device:minute:`

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");

        if (!deviceId) {
            return NextResponse.json(
                { error: "deviceId is required" },
                { status: 400 }
            );
        }

        const key = CacheKey + deviceId

        const cache = await redis.get(key);
        if (cache) {
            return NextResponse.json(
                JSON.parse(cache)
            )
        }

        const readings = await prisma.sensorReading.findMany({
            where: {
                deviceId,
            },
            orderBy: {
                measuredAt: 'desc'
            },
            take: 50
        });

        const cleanedReadings = readings.map(reading => {
            return Object.fromEntries(
                Object.entries(reading).filter(([_, value]) => value !== null)
            );
        });

        await redis.setex(key, 60, JSON.stringify(cleanedReadings));

        return NextResponse.json(
            cleanedReadings,
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}