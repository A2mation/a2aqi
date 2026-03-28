
import { NextResponse } from "next/server";
import { getHeatmap } from "../service/hourly.reading.monitor.service";
import { getSingleDeviceDetails } from "../service/device.monitor.service";
import { getDailyBasicDashboardStats } from "../service/dailycustom.readings.service";
import { handleMonitorError } from "@/lib/handleRoleError";

export async function deviceIdController(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    try {
        const deviceId = (await params.params).deviceId;

        const { searchParams } = new URL(req.url);

        const startDate = searchParams.get("startDate");

        if (!deviceId || typeof deviceId !== "string") {
            return NextResponse.json({
                success: false,
                message: "deviceId is required",
            }, {
                status: 400
            });
        }

        if (!startDate || typeof startDate !== "string") {
            return NextResponse.json({
                success: false,
                message: "startDate is required (YYYY-MM-DD)",
            }, {
                status: 400
            });
        }

        const data = await getHeatmap(deviceId, startDate);
        const device = await getSingleDeviceDetails(deviceId);
        const last30Days = await getDailyBasicDashboardStats(deviceId, {
            type: 'custom',
            dateStr: startDate,
            day: 30
        });

        return NextResponse.json({
            success: true,
            hourly: data.heatmap,
            last30Days,
            device,
        });

    } catch (error: any) {
        return handleMonitorError(error);
    }
}
