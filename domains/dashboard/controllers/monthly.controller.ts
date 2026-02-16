import { NextResponse } from "next/server";
import { MonthlyAggregationService } from "../services/monthly-aggregation.service";

export async function MonthlyDashboardController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const year = searchParams.get("year");
        const month = searchParams.get("month");

        if (!deviceId || !year || !month) {
            return NextResponse.json(
                { error: "deviceId, year and month are required" },
                { status: 400 }
            );
        }

        const yearNum = Number(year);
        const monthNum = Number(month);

        if (isNaN(yearNum) || isNaN(monthNum)) {
            return NextResponse.json(
                { error: "year and month must be valid numbers" },
                { status: 400 }
            );
        }

        const data = await MonthlyAggregationService.getMonthly(
            deviceId,
            yearNum,
            monthNum
        );

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
