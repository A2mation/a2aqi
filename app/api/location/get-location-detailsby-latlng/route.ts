import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"


// Used later when we have enough data.
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const lat = Number(searchParams.get("lat"));
        const lng = Number(searchParams.get("lng"));

        if (isNaN(lat) || isNaN(lng)) {
            return new Response("Invalid coordinates", { status: 400 });
        }

        const res = await prisma.aQIReading.findFirst({
            where: {
                lat,
                lng,
            },
            select: {
                id: true,
                city: true,
                aqi: true,
                pm25: true,
                pm10: true,
                o3: true,
                no2: true,
                so2: true,
                co: true,
            },
            orderBy: { measuredAt: "desc" },
        })


        return NextResponse.json({
            res
        }, {
            status: 200
        })

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
