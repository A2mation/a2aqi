import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { cities } from "@/data/popullar-cities";
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates";


export async function GET(req: Request) {
    try {

        const BATCH_SIZE = 20;
        const results: any[] = [];
        console.log(cities.length)

        for (let i = 0; i < cities.length; i += BATCH_SIZE) {
            const batch = cities.slice(i, i + BATCH_SIZE);

            await Promise.allSettled(
                batch.map(async (city) => {
                    try {
                        const waqi = await fetchAqiByCoordinates(city.lat, city.lng);

                        if (!waqi?.data?.aqi) {
                            results.push({ city: city.name, status: "no-data" });
                            return;
                        }

                        await prisma.aQIReading.upsert({
                            where: {
                                lat_lng_source_measuredAt: {
                                    lat: city.lat,
                                    lng: city.lng,
                                    source: "WAQI",
                                    measuredAt: new Date(waqi.data.time.iso),
                                },
                            },
                            update: {
                                aqi: waqi.data.aqi,
                                pm25: waqi.data.iaqi?.pm25?.v,
                                pm10: waqi.data.iaqi?.pm10?.v,
                                no2: waqi.data.iaqi?.no2?.v,
                                so2: waqi.data.iaqi?.so2?.v,
                                o3: waqi.data.iaqi?.o3?.v,
                                co: waqi.data.iaqi?.co?.v,
                                temperature: waqi.data.iaqi?.t?.v,
                                humidity: waqi.data.iaqi?.h?.v,
                            },
                            create: {
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
                                street: city.street,
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
                        // console.error(city.name, err);
                        results.push({ city: city.name, status: "failed" });
                    }
                })
            );
        }

        // console.log("🔥 Popular cities cron completed", {
        //     processed: results.length,
        //     success: results.filter(r => r.status === "ok").length,
        // });

        return NextResponse.json({
            success: true,
            processed: results.length,
            // results,
        });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }

}
