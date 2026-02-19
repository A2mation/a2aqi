import { NextRequest, NextResponse } from "next/server";
import { QuarterlyAggregationService } from "@/domains/dashboard/services/quarterly-aggregation.service";

export async function QuarterlyDashboardController(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const date = searchParams.get("date"); // YYYY-MM-DD

        if (!deviceId || !date) {
            return NextResponse.json(
                { error: "deviceId and date are required" },
                { status: 400 }
            );
        }

        const result = await QuarterlyAggregationService.getQuarterly(deviceId, date);

        return NextResponse.json(result);
    } catch (error) {
        console.error("QuarterlyDashboardController error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
