
import { NextResponse } from "next/server";
import { getHeatmap } from "../service/hourly.reading.monitor.service";
import { getSingleDeviceDetails } from "../service/device.monitor.service";

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

        return NextResponse.json({
            success: true,
            hourly: data.heatmap,
            device,
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}