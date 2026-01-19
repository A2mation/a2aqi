import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getTodayWindow, adjustTemperature } from "@/helpers/time";

export async function GET(req: Request) {
    try {

        const {
            searchParams
        } = new URL(req.url)

        const country = searchParams.get("country")?.trim()
        const state = searchParams.get("state")?.trim().replace("-", " ");

        if (!country || !state) {
            return new NextResponse("Country not found", {
                status: 404
            })
        }

        const { startOfToday, endOfToday } = getTodayWindow();

        const states = await prisma.aQIReading.aggregate({
            where: {
                state: {
                    equals: state,
                    mode: "insensitive",
                },
                country: {
                    equals: country,
                    mode: "insensitive",
                },
                measuredAt: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
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


        if (states._count._all === 0) {
            return new NextResponse("No data for today", {
                status: 404
            })
        }
        const avgTemp = states._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)


        return NextResponse.json({
            averages: {
                aqi: states._avg.aqi,
                pm10: states._avg.pm10,
                pm25: states._avg.pm25,
                temperature: adjustedTemperature,
                humidity: states._avg.humidity,
                state: state,
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