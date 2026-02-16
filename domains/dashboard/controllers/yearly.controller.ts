import { NextResponse } from "next/server";
import { YearlyAggregationService } from "../services/yearly-aggregation.service";

export async function YearlyDashboardController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const year = searchParams.get("year");

        if (!deviceId || !year) {
            return NextResponse.json(
                { error: "deviceId and year are required" },
                { status: 400 }
            );
        }

        const yearNum = Number(year);

        if (isNaN(yearNum)) {
            return NextResponse.json(
                { error: "year must be a valid number" },
                { status: 400 }
            );
        }

        const data = await YearlyAggregationService.getYearly(deviceId, yearNum);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
