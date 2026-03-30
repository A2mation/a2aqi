import { registerDeviceToMonitorController } from "@/domains/monitor/controller/device.register.controller";

export async function POST(req: Request) {
    return registerDeviceToMonitorController(req);
}