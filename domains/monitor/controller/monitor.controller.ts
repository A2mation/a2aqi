
import { NextResponse } from "next/server";

import { latestsensorReadingWithDeviceDetails } from "../service/latest.sensor.monitor.service";

export async function MonitorController(req: Request,
) {
    try {

        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");

        if (!deviceId || typeof deviceId !== "string") {
            return NextResponse.json({
                success: false,
                message: "deviceId is required",
            }, {
                status: 400
            });
        }

        if (typeof deviceId !== "string") {
            return NextResponse.json({
                success: false,
                message: "startDate is required (YYYY-MM-DD)",
            }, {
                status: 400
            });
        }

        const device = await latestsensorReadingWithDeviceDetails(deviceId);

        return NextResponse.json({
            success: true,
            device
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}
