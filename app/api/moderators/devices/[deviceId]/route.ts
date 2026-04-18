import { ModeratorDeviceIdControler } from "@/domains/moderator/controller/device.moderator.controller";


export async function GET(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    return new ModeratorDeviceIdControler().deviceIdController(req, params);
}       