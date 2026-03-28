import { handleMonitorError } from "@/lib/handleRoleError";
import { NextResponse } from "next/server";
import { getDailyBasicDashboardStats } from "../service/dailycustom.readings.service";

export async function deviceHistoryController(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    try {
        const { deviceId } = await params.params;
        const { searchParams } = new URL(req.url);

        const daysRaw = searchParams.get("days");
        const days = daysRaw ? Number(daysRaw) : NaN;

        if (!deviceId) {
            return NextResponse.json({
                success: false,
                message: "deviceId is required",
            }, { status: 400 });
        }


        if (!daysRaw || isNaN(days)) {
            return NextResponse.json({
                success: false,
                message: "days parameter must be a valid number",
            }, { status: 400 });
        }

        const startDate = new Date().toISOString().split('T')[0];

        const history = await getDailyBasicDashboardStats(deviceId, {
            type: 'custom',
            dateStr: startDate,
            day: days 
        });

        return NextResponse.json({
            success: true,
            history,
        });

    } catch (error: any) {
        return handleMonitorError(error);
    }
}