import { MonitorController } from "@/domains/monitor/controller/monitor.controller";

export async function GET(req: Request,
) {
    return MonitorController(req);
}       