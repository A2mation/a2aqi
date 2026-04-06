import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { getTodayWindow } from "@/helpers/time";

export async function GET(req: Request) {
    try {

        const {
            searchParams
        } = new URL(req.url)
        const q = searchParams.get("q")?.trim()
        if (!q || q.length < 2) {
            return NextResponse.json({ cities: [], states: [] })
        }

        /* ---------------- CITIES ---------------- */

        const { startOfToday, endOfToday } = getTodayWindow();

        const cityResults = await prisma.aQIReading.findMany({
            where: {
                city: {
                    startsWith: q,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday
                }
            },
            select: {
                id: true,
                city: true,
                state: true,
                country: true,
                aqi: true,
                temperature: true,
                lat: true,
                lng: true,
                createdAt: true
            },
            take: 10,
        })

        const cityMap = new Map()
        for (const r of cityResults) {
            if (!cityMap.has(r.city)) {
                cityMap.set(r.city, {
                    id: r.id,
                    name: r.city,
                    state: r.state,
                    country: r.country,
                    aqi: r.aqi,
                    temp: r.temperature,
                    lat: r.lat,
                    lng: r.lng
                })
            }
        }

        /* ---------------- STATES ---------------- */
        const stateResults = await prisma.aQIReading.findMany({
            where: {
                state: {
                    startsWith: q,
                    mode: "insensitive"
                },
            },
            orderBy: {
                measuredAt: "desc",
            },
            select: {
                id: true,
                state: true,
                city: true,
                country: true,
                aqi: true,
                temperature: true,
                lat: true,
                lng: true,
            },
            take: 10,
        })

        const stateMap = new Map()
        for (const r of stateResults) {
            if (!stateMap.has(r.state)) {
                stateMap.set(r.state, {
                    id: r.id,
                    name: r.state,
                    state: r.state,
                    city: r.city,
                    country: r.country,
                    aqi: r.aqi,
                    temp: r.temperature,
                    lat: r.lat,
                    lng: r.lng
                })
            }
        }

        const finalCities = Array.from(cityMap.values());
        const finalStates = Array.from(stateMap.values());

        if (finalCities.length === 0 && finalStates.length === 0) {
            return NextResponse.json({ message: "No results found", success: false }, { status: 404 });
        }

        return NextResponse.json({
            cities: finalCities,
            states: finalStates,
        }, {
            status: 200
        })


    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", {
            status: 500
        })
    }
}
