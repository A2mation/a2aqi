import { deviceHistoryController } from "@/domains/monitor/controller/device.history.controller";


export async function GET(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    return deviceHistoryController(req, params);
}       