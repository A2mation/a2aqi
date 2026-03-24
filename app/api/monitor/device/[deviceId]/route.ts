import { deviceIdController } from "@/domains/monitor/controller/deviceId.monitor.controller";

export async function GET(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    return deviceIdController(req, params);
}       