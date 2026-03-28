import { NextResponse } from "next/server";

import { monitorGuard } from "@/lib/monitorAuth";
import { handleMonitorError } from "@/lib/handleRoleError";
import { getDevicesByMonitorWithLatestAQIReadings } from "../service/device.monitor.service";


export async function MonitorController(req: Request,) {
    try {

        const { monitor } = await monitorGuard();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const data = await getDevicesByMonitorWithLatestAQIReadings(monitor.id, search, limit, skip);

        return NextResponse.json({
            success: true,
            devices: data.formattedDevices.map((item) => item.devices),
            totalCount: data.totalCount
        });

    } catch (error: any) {
        return handleMonitorError(error);
    }
}
