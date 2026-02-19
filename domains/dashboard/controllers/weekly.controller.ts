import { NextResponse } from "next/server";

import { WeeklyAggregationService } from "../services/weekly-aggregation.service";

export async function WeeklyDashboardController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const date = searchParams.get("date"); // optional (YYYY-MM-DD)

        if (!deviceId) {
            return NextResponse.json(
                { error: "deviceId is required" },
                { status: 400 }
            );
        }

        const now = new Date();

        // fallback: if no date provided, use today
        const dateStr = date ? date : now.toISOString().split("T")[0];

        const data = await WeeklyAggregationService.getWeekly(deviceId, dateStr);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
