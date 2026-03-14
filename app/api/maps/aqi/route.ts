import { transformInternalData } from "@/helpers/transformInternalData";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const north = Number(searchParams.get("north"));
    const south = Number(searchParams.get("south"));
    const east = Number(searchParams.get("east"));
    const west = Number(searchParams.get("west"));

    if ([north, south, east, west].some(isNaN)) {
        return new Response("Invalid bounds", { status: 400 });
    }

    const readings = await prisma.aQIReading.findMany({
        where: {
            lat: { gte: south, lte: north },
            lng: { gte: west, lte: east },
        },
        orderBy: { measuredAt: "desc" },
        take: 500,
    });

    const c = await prisma.latestSensorReading.findMany({
        where: {
            device: {
                lat: { gte: south, lte: north },
                lng: { gte: west, lte: east },
            }
        },
        take: 10,
        select: {
            id: true,
            aqi: true,
            pm10: true,
            pm25: true,
            so2: true,
            no2: true,
            co2: true,
            co: true,
            o3: true,
            noise: true,
            pm1: true,
            tvoc: true,
            smoke: true,
            methane: true,
            h2: true,
            ammonia: true,
            h2s: true,
            temperature: true,
            humidity: true,
            device: {
                select: {
                    serialNo: true,
                    lat: true,
                    lng: true,
                    loaction: true
                }
            },
            updatedAt: true
        }
    });

    const sensorData = transformInternalData(c, readings[0].state ?? 'Not Found');

    const allReadings = [...readings, ...sensorData]

    const response = allReadings.map((r) => ({
        id: r.id,
        name: r.city,
        lat: r.lat,
        lng: r.lng,
        aqi: r.aqi,
        pm25: r.pm25 ?? 0,
        pm10: r.pm10 ?? 0,
        o3: r.o3 ?? 0,
        no2: r.no2 ?? 0,
        so2: r.so2 ?? 0,
        co: r.co ?? 0,
    }));

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
    });
}
