import { NextResponse } from "next/server";
import { LiveService } from "../services/live.service";

export async function LiveDashboardController(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");

        if (!deviceId) {
            return NextResponse.json(
                { error: "deviceId is required" },
                { status: 400 }
            );
        }

        const data = await LiveService.getLive(deviceId);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
