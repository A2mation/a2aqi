import { NextResponse } from "next/server";
import { DashboardOverviewService } from "../services/dashboard-overview.service";

export async function DashboardOverviewController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const dateParam = searchParams.get("date");

        if (!deviceId) {
            return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
        }

        // fallback to today's date if date not provided
        const date = dateParam
            ? dateParam
            : new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const data = await DashboardOverviewService.getOverview(deviceId, date);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
