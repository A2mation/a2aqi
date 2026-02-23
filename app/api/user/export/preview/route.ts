import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { MAX_DAILY_DAYS, MAX_HOURLY_DAYS } from "@/constant/Export-Metrices"


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)

        const deviceId = searchParams.get("deviceId")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const type = searchParams.get("type") ?? "hourly"

        if (!deviceId || !startDate || !endDate) {
            return NextResponse.json(
                { error: "deviceId, startDate and endDate are required" },
                { status: 400 }
            )
        }

        if (!["hourly", "daily"].includes(type)) {
            return NextResponse.json(
                { error: "type must be hourly or daily" },
                { status: 400 }
            )
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            )
        }

        if (end < start) {
            return NextResponse.json(
                { error: "End date must be after start date" },
                { status: 400 }
            )
        }

        const diffDays =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

        if (type === "hourly" && diffDays > MAX_HOURLY_DAYS) {
            return NextResponse.json(
                { error: "Hourly preview cannot exceed 90 days" },
                { status: 400 }
            )
        }

        if (type === "daily" && diffDays > MAX_DAILY_DAYS) {
            return NextResponse.json(
                { error: "Daily preview cannot exceed 365 days" },
                { status: 400 }
            )
        }

        let count = 0

        if (type === "hourly") {
            count = await prisma.hourlyAggregateReading.count({
                where: {
                    deviceId,
                    hourStart: {
                        gte: start,
                        lte: end,
                    },
                },
            })
        } else {
            count = await prisma.dailyAggregateReading.count({
                where: {
                    deviceId,
                    dayStart: {
                        gte: start,
                        lte: end,
                    },
                },
            })
        }

        return NextResponse.json({
            count,
            type,
        })
    } catch (error) {
        console.error("Preview API Error:", error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}