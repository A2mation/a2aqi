import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getTodayWindow, adjustTemperature } from "@/helpers/time";

export async function GET(req: Request) {
    try {

        const {
            searchParams
        } = new URL(req.url)

        const country = searchParams.get("country")?.trim()

        if (!country) {
            return new NextResponse("Country not found", {
                status: 404
            })
        }

        const { startOfToday, endOfToday } = getTodayWindow();
        console.log(startOfToday, endOfToday)

        const countires = await prisma.aQIReading.aggregate({
            where: {
                country: {
                    equals: country,
                    mode: "insensitive",
                },
                measuredAt: {
                    gte: startOfToday,
                    lt: endOfToday
                }
            },
            _avg: {
                aqi: true,
                pm10: true,
                pm25: true,
                temperature: true,
                humidity: true,
            },
            _count: {
                _all: true,
            },

        })
        
        if (countires._count._all === 0) {
            return new NextResponse("No data for today", {
                status: 404
            })
        }
        const avgTemp = countires._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)


        return NextResponse.json({
            averages: {
                aqi: countires._avg.aqi,
                pm10: countires._avg.pm10,
                pm25: countires._avg.pm25,
                temperature: adjustedTemperature,
                humidity: countires._avg.humidity,
                country: country
            },
        }, {
            status: 200
        })

    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", {
            status: 500
        })
    }
}