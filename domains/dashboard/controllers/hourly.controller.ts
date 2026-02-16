import { NextResponse } from "next/server";
import { HourlyAggregationService } from "../services/hourly-aggregation.service";

export async function HourlyDashboardController(req: Request) {
    try {

        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const date = searchParams.get("date");

        if (!deviceId || !date) {
            return NextResponse.json(
                { error: "deviceId and date are required" },
                { status: 400 }
            );
        }

        const data = await HourlyAggregationService.getHourly(deviceId, date);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
