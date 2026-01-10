import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const popularCitiesName = [
    "Ahmedabad",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Mumbai",
    "Delhi",
    "Pune",
];

const CACHE_KEY = "popular-cities:aqi";
const CACHE_TTL = 60 * 60 * 12; // 12 hours

export async function GET() {
    try {
        
        const cached = await redis.get(CACHE_KEY);

        if (cached) {
            return NextResponse.json(cached, {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
                    "X-Cache": "HIT",
                },
            });
        }

        
        const readings = await prisma.aQIReading.findMany({
            where: {
                location: { in: popularCitiesName },
            },
            orderBy: [
                { location: "asc" },
                { measuredAt: "desc" },
            ],
            distinct: ["location"],
            select: {
                location: true,
                aqi: true,
                temperature: true,
                humidity: true,
                measuredAt: true,
            },
        });

       
        await redis.set(CACHE_KEY, readings, {
            ex: CACHE_TTL,
        });

        return NextResponse.json(readings, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
                "X-Cache": "MISS",
            },
        });
        
    } catch (error) {
        console.error("Popular cities AQI error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
