import { handleModeratorError } from "@/lib/handleRoleError";
import { ModeratorDeviceService } from "../service/device.moderator.service";
import { NextResponse } from "next/server";

export class ModeratorDeviceIdControler {

    private obj = new ModeratorDeviceService();

    async deviceIdController(req: Request,
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

            const [data, device, last30Days, latestReading] = await Promise.all([
                this.obj.getHeatmap(deviceId, startDate),
                this.obj.getSingleDeviceDetails(deviceId),
                this.obj.getDailyBasicDashboardStats(deviceId, {
                    type: 'custom',
                    dateStr: startDate,
                    day: 30
                }),
                this.obj.getLatestSensorData(deviceId)
            ]);

            return NextResponse.json({
                success: true,
                device,
                hourly: data.heatmap,
                last30Days,
                latestReading,
            });
        } catch (error) {
            return handleModeratorError(error);
        }

    }

}
