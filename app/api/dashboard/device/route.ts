import { DeviceController } from "@/domains/dashboard/controllers/device.controller";


export async function GET(req: Request) {
    return DeviceController(req);
}
