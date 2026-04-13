import { transformInternalData } from "@/helpers/transformInternalData";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";



export async function GET(req: Request) {
    const readings = await prisma.aQIReading.findMany({
        orderBy: { measuredAt: "desc" },
        select:{
            id: true,
            lat: true,
            lng: true,
            aqi: true,
            temperature: true
        },
    });

    const c = await prisma.latestSensorReading.findMany({
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
