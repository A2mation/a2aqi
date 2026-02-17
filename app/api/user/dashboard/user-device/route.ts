import { UserDeviceController } from "@/domains/dashboard/controllers/user-device.controller";

export async function GET(req: Request) {
    return UserDeviceController(req);
}
