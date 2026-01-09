import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cities } from "@/data/popullar-cities";
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates";


export async function GET(req: Request) {
    try {
        const isVercelCron = req.headers.get("x-vercel-cron");
        const { searchParams } = new URL(req.url);

        if (!isVercelCron) {
            return new Response("Forbidden", { status: 403 });
        }

        if (searchParams.get("token") !== process.env.CRON_SECRET) {
            return new Response("Unauthorized", { status: 401 });
        }

        const results = [];

        for (const city of cities) {
            try {
                const waqi = await fetchAqiByCoordinates(city.lat, city.lng);

                if (!waqi) {
                    return new NextResponse("Could Not fetch the data");
                }

                const d = {
                    aqi: waqi.data.aqi,
                    pm25: waqi.data.iaqi?.pm25?.v,
                    pm10: waqi.data.iaqi?.pm10?.v,
                    no2: waqi.data.iaqi?.no2?.v,
                    so2: waqi.data.iaqi?.so2?.v,
                    o3: waqi.data.iaqi?.o3?.v,
                    co: waqi.data.iaqi?.co?.v,
                    temperature: waqi.data.iaqi?.t?.v,
                    humidity: waqi.data.iaqi?.h?.v,
                    measuredAt: new Date(waqi.data.time.iso),
                }

                await prisma.aQIReading.create({
                    data: {
                        ...d,
                        lat: city.lat,
                        lng: city.lng,
                        location: city.name,
                        city: city.name,
                        state: city.state,
                        country: city.country,
                        source: "WAQI",
                    },
                });

                results.push({ city: city.name, status: "ok" });
            } catch (err) {
                console.error(city.name, err);
                results.push({ city: city.name, status: "failed" });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
        });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }

}
