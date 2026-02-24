import { NextRequest, NextResponse } from "next/server"
import type {
    HourlyAggregateReading,
    DailyAggregateReading,
} from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { SENSORUNIT } from "@/constant/sensor-units"
import { MAX_DAILY_DAYS, MAX_HOURLY_DAYS } from "@/constant/Export-Metrices"
import { userGuard } from "@/lib/userAuth"


function escapeCSV(value: unknown): string {
    if (value == null) return ""
    const str = String(value)

    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`
    }

    return str
}


export async function POST(req: NextRequest) {
    let exportLogId: string | null = null;

    try {

        const user = await userGuard();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const {
            deviceId,
            startDate,
            endDate,
            type
        } = await req.json();

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

        const exportLog = await prisma.exportLog.create({
            data: {
                userId: user.user.id,
                deviceId,
                format: "CSV",
                status: "PROCESSING",
                fromDate: start,
                toDate: end,
                metadata: {
                    type,
                },
            },
        })

        exportLogId = exportLog.id

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            )
        }

        const diffDays =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

        if (type === "hourly" && diffDays > MAX_HOURLY_DAYS) {
            return NextResponse.json(
                { error: "Hourly export cannot exceed 90 days" },
                { status: 400 }
            )
        }

        if (type === "daily" && diffDays > MAX_DAILY_DAYS) {
            return NextResponse.json(
                { error: "Daily export cannot exceed 365 days" },
                { status: 400 }
            )
        }

        let records:
            | HourlyAggregateReading[]
            | DailyAggregateReading[] = []

        if (type === "hourly") {
            records = await prisma.hourlyAggregateReading.findMany({
                where: {
                    deviceId,
                    hourStart: {
                        gte: start,
                        lte: end,
                    },
                },
                orderBy: { hourStart: "asc" },
            })
        } else {
            records = await prisma.dailyAggregateReading.findMany({
                where: {
                    deviceId,
                    dayStart: {
                        gte: start,
                        lte: end,
                    },
                },
                orderBy: { dayStart: "asc" },
            })
        }

        if (!records.length) {
            return NextResponse.json(
                { error: "No data found for selected range" },
                { status: 404 }
            )
        }

        const sensors = [
            "Aqi",
            "Pm10",
            "Pm25",
            "So2",
            "No2",
            "Co2",
            "Co",
            "O3",
            "Noise",
            "PM1",
            "Tvoc",
            "Smoke",
            "Methane",
            "H2",
            "Ammonia",
            "H2s",
            "Temperature",
            "Humidity",
        ]

        const formatted = records.map((r) => {
            const date =
                type === "hourly"
                    ? (r as HourlyAggregateReading).hourStart
                    : (r as DailyAggregateReading).dayStart

            const base: Record<string, unknown> = {}

            base["Date"] = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })

            if (type === "hourly") {
                base["Time"] = date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
            }

            sensors.forEach((sensor) => {
                const sumKey = `sum${sensor}` as keyof typeof r
                const minKey = `min${sensor}` as keyof typeof r
                const maxKey = `max${sensor}` as keyof typeof r

                if ((r as any)[sumKey] != null && (r as any).count > 0) {
                    base[`Avg${sensor}`] = (
                        (r as any)[sumKey] / (r as any).count
                    ).toFixed(2)
                }

                if ((r as any)[minKey] != null) {
                    base[`Min${sensor}`] = (r as any)[minKey]
                }

                if ((r as any)[maxKey] != null) {
                    base[`Max${sensor}`] = (r as any)[maxKey]
                }
            })

            return base
        })

        const rawHeaders = Array.from(
            new Set(formatted.flatMap((obj) => Object.keys(obj)))
        )

        const headers = rawHeaders.map((header) => {
            if (header === "Date" || header === "Time") return header

            const match = header.match(/^(Avg|Min|Max)(.+)$/)
            if (!match) return header

            const sensorName = match[2]
            const unit = SENSORUNIT[sensorName]

            return unit ? `${header} (${unit})` : header
        })

        const rows = formatted.map((row) =>
            rawHeaders.map((header) =>
                escapeCSV(row[header] ?? "")
            )
        )

        const FILE_NAME = `a2aqi-${type}-report`

        const metadata = [
            "Source: a2aqi.com",
            `Export Type: ${FILE_NAME}`,
            `Generated At: ${new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            })}`,
            "",
        ]

        const csvLines = [
            ...metadata,
            headers.map(escapeCSV).join(","),
            ...rows.map((r) => r.join(",")),
        ]

        const csv = "\uFEFF" + csvLines.join("\n")

        const fileSizeMB = Buffer.byteLength(csv, "utf8") / (1024 * 1024)

        await prisma.exportLog.update({
            where: { id: exportLogId },
            data: {
                status: "COMPLETED",
                completedAt: new Date(),
                fileSize: fileSizeMB,
            },
        })

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename=${FILE_NAME}.csv`,
            },
        })
    } catch (error: any) {

        if (exportLogId) {
            await prisma.exportLog.update({
                where: { id: exportLogId },
                data: {
                    status: "FAILED",
                    errorMessage: error.message,
                    completedAt: new Date(),
                },
            })
        }
        console.error("Export API Error:", error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}


export async function GET(req: NextRequest) {
    try {

        const user = await userGuard();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const limit = 10;

        const logs = await prisma.exportLog.findMany({
            where: { userId: user.user.id },
            take: limit,
            // If cursor exists, start after that timestamp
            ...(cursor && {
                skip: 1, // Skip the actual cursor record
                cursor: { id: cursor },
            }),
            select: {
                id: true,
                deviceId: true,
                status: true,
                completedAt: true,
                requestedAt: true,
                format: true,
                fileSize: true,
                fileUrl: true,
                fromDate: true,
                toDate: true,
                metadata: true,
                errorMessage: true,
                device: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                completedAt: "desc"
            }
        });

        const nextCursor = logs.length === limit ? logs[logs.length - 1].id : null;

        return NextResponse.json({
            items: logs,
            nextCursor
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}