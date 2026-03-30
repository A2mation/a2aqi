import { NextResponse } from "next/server";

import { monitorGuard } from "@/lib/monitorAuth";
import { existingAssignment, getSingleDeviceDetailsSerialNo, registerDevice } from "../service/device.monitor.service";


export async function registerDeviceToMonitorController(req: Request) {
    try {

        const { monitor } = await monitorGuard();

        if (!monitor) {
            return NextResponse.json(
                { success: false, message: "Monitor not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { serialNo } = body;

        if (!serialNo || !monitor.id) {
            return NextResponse.json(
                { success: false, message: "serialNo and monitorId are required" },
                { status: 400 }
            );
        }

        const deviceId = await getSingleDeviceDetailsSerialNo(serialNo);

        if (!deviceId) {
            return NextResponse.json(
                { success: false, message: "Device not found" },
                { status: 404 }
            );
        }


        const existingAssign = await existingAssignment(deviceId);

        if (existingAssign) {
            return NextResponse.json(
                { success: false, message: "Device already assigned to a monitor" },
                { status: 409 }
            );
        }

        const assignment = await registerDevice(serialNo, monitor.id);

        return NextResponse.json(
            {
                success: true,
                message: "Device assigned successfully",
                data: assignment
            },
            { status: 201 }
        );

    } catch (error: any) {

        if (error.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Duplicate assignment" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}