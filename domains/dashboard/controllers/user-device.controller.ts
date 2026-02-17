import { NextResponse } from "next/server";


import { getAuthSession } from "@/auth";
import { UserDeviceService } from "../services/user-device.service";

export async function UserDeviceController(req: Request) {
    try {
        const session = await getAuthSession();

        const userId = session?.user.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
        }

        const data = await UserDeviceService.getUserDevices(userId);

        return NextResponse.json({ success: true, data }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
