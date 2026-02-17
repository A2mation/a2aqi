import { NextResponse } from "next/server";
import { DeviceService } from "../services/device.service";

export async function DeviceController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const serialNo = searchParams.get("serialNo");

        if (!deviceId && !serialNo) {
            return NextResponse.json(
                { error: "deviceId or serialNo is required" },
                { status: 400 }
            );
        }

        const data = await DeviceService.getDeviceInfo(deviceId, serialNo);

        if (!data) {
            return NextResponse.json({ error: "Device not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
