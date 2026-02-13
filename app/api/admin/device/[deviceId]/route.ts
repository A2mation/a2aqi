import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET(
    req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }) {
    try {

        await adminGuard();

        const { deviceId } = await params.params;

        if (!deviceId) {
            return new NextResponse("Device ID not Found", {
                status: 400
            })
        }

        const device = await prisma.device.findUnique({
            where: {
                id: deviceId
            }
        })

        if (!device) {
            return new NextResponse("Device not found", { status: 404 });
        }

        return NextResponse.json(device);

    } catch (error) {
        return handleAdminError(error);
    }
}


export async function PATCH(
    req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    try {

        await adminGuard();

        const { deviceId } = await params.params;

        if (!deviceId) {
            return new NextResponse("Device ID not Found", {
                status: 400
            })
        }


        const body = await req.json();

        const { name, serialNo, modelId, lat, lng, status } = body as {
            name?: string;
            serialNo: string;
            modelId: string;
            lat?: string | null;
            lng?: string | null;
            status?: DeviceStatus;
        };
        // TODO: ADD user Details add from ADMIN side

        if (!serialNo) {
            return new NextResponse("Serial No is required", { status: 400 });
        }

        if (!modelId) {
            return new NextResponse("Model ID is required", { status: 400 });
        }

        const model = await prisma.deviceModel.findUnique({
            where: {
                id: modelId
            }
        })

        if (!model) {
            return new NextResponse("Invalid Model", { status: 400 })
        }

        const parsedLat = lat ? parseFloat(lat) : null;
        const parsedLng = lng ? parseFloat(lng) : null;

        if (lat && isNaN(parsedLat!)) {
            return new NextResponse("Invalid latitude value", { status: 400 });
        }

        if (lng && isNaN(parsedLng!)) {
            return new NextResponse("Invalid longitude value", { status: 400 });
        }

        const updatedDevice = await prisma.device.update({
            where: { id: deviceId },
            data: {
                name,
                serialNo,
                modelId,
                lat: parsedLat,
                lng: parsedLng,
                status: status ?? DeviceStatus.UNASSIGNED,

                assignedAt:
                    status === DeviceStatus.ASSIGNED ? new Date() : null,
            },
        });

        return NextResponse.json(updatedDevice);


    } catch (error) {
        return handleAdminError(error);
    }
}


export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }
) {
    try {

        await adminGuard();

        const { deviceId } = await params.params;
        if (!deviceId) {
            return new NextResponse("Device ID not Found", {
                status: 400
            })
        }

        const res = await prisma.device.delete({
            where: {
                id: deviceId
            }
        })

        if (!res) {
            return new NextResponse("Device not found", { status: 404 });
        }

        return new NextResponse("Device deleted successfully", { status: 200 });
    } catch (error) {
        return handleAdminError(error);
    }
}