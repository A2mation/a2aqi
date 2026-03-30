import { transformInternalHistoryData } from "@/helpers/transformInternalData";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const deviceId = searchParams.get("deviceId");

        if (!deviceId) return new NextResponse("Invalid device ID", { status: 400 });

        let currentData: any = null;
        let historyData: any[] = [];

        /**
         * For the AQIReading we don't have a direct deviceId, 
         * so we will match based on lat/lng of the current reading to fetch history.
         */

        currentData = await prisma.aQIReading.findUnique({
            where: { id: deviceId },
        });

        if (currentData) {
            const rawHistory = await prisma.aQIReading.findMany({
                where: {
                    lat: currentData.lat,
                    lng: currentData.lng
                },
                take: 7,
                orderBy: { createdAt: "desc" }
            });
            historyData = transformInternalHistoryData(rawHistory, "External");
            currentData = transformInternalHistoryData([currentData], "External")[0];
        }
        
        else {
            currentData = await prisma.latestSensorReading.findUnique({
                where: { deviceId: deviceId },
                include: { device: true }
            });

            if (currentData) {
                const rawHistory = await prisma.dailyAggregateReading.findMany({
                    where: { deviceId: deviceId },
                    select: {
                        id: true, count: true, dayStart: true,
                        sumAqi: true, sumPm10: true, sumPm25: true, sumSo2: true,
                        sumNo2: true, sumCo2: true, sumCo: true, sumO3: true,
                        sumNoise: true, sumPM1: true, sumTvoc: true, sumSmoke: true,
                        sumMethane: true, sumH2: true, sumAmmonia: true, sumH2s: true,
                        sumTemperature: true, sumHumidity: true
                    },
                    take: 7,
                    orderBy: { dayStart: "desc" }
                });
                historyData = transformInternalHistoryData(rawHistory, "Internal");
                currentData = transformInternalHistoryData([currentData], "Internal")[0];
            }
        }

        if (!currentData) return new NextResponse("Device not found", { status: 404 });

        return NextResponse.json({
            success: true,
            current: currentData,
            history: historyData
        });

    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
    }
}