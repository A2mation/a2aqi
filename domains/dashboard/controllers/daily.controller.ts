import { NextResponse } from "next/server";

import { DailyAggregationService } from "../services/daily-aggregation.service";

export async function DailyDashboardController(req: Request) {
    try {

        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const dayStart = searchParams.get("date");

        if (!deviceId || !dayStart) {
            return NextResponse.json(
                { error: "deviceId and date are required" },
                { status: 400 }
            );
        }

        const data = await DailyAggregationService.getDaily(deviceId, dayStart);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
