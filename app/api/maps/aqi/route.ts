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
        select:{
            id: true,
            lat: true,
            lng: true,
            aqi: true,
            temperature: true
        },
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
            temperature: true,
            device: {
                select: {
                    id: true,
                    lat: true,
                    lng: true
                }
            },
        }
    });

    const sensorData = transformInternalData(c);

    const allReadings = [...readings, ...sensorData]

    const response = allReadings.map((r) => ({
        id: r.id,
        lat: r.lat,
        lng: r.lng,
        aqi: r.aqi,
        temperature: r.temperature
    }));

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
    });
}
