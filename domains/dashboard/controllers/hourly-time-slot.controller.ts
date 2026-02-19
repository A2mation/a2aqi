import { NextRequest, NextResponse } from "next/server";
import { HourlyTimeSlotService } from "../services/hourly-time-slot.service";

export class HourlyTimeSlotController {
    private service: HourlyTimeSlotService;

    constructor() {
        this.service = new HourlyTimeSlotService();
    }

    async getHourlyHeatmap(req: NextRequest) {
        const { searchParams } = new URL(req.url);

        const deviceId = searchParams.get("deviceId");
        const startDate = searchParams.get("startDate");

        if (!deviceId) {
            return NextResponse.json(
                { success: false, message: "deviceId is required" },
                { status: 400 }
            );
        }

        if (!startDate) {
            return NextResponse.json(
                { success: false, message: "startDate is required" },
                { status: 400 }
            );
        }

        const data = await this.service.getHeatmap(deviceId, startDate);

        return NextResponse.json({
            success: true,
            data,
        });
    }
}
