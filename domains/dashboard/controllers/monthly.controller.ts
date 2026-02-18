import { NextResponse } from "next/server";
import { MonthlyAggregationService } from "../services/monthly-aggregation.service";

export async function MonthlyDashboardController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const year = searchParams.get("year");
        const month = searchParams.get("month");

        if (!deviceId) {
            return NextResponse.json(
                { error: "deviceId is required" },
                { status: 400 }
            );
        }

        const now = new Date();

        // fallback: if no year/month provided, use current year/month
        const yearNum = year ? Number(year) : now.getFullYear();
        const monthNum = month ? Number(month) : now.getMonth() + 1;

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
