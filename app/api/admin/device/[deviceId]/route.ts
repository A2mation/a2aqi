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
    { params }: { params: Promise<{ deviceId: string }> }
) {
    try {
        await adminGuard();
        const { deviceId } = await params;

        if (!deviceId) {
            return new NextResponse("Device ID not Found", { status: 400 });
        }

        const body = await req.json();
        const { name, user, isUserMode, serialNo, modelId, lat, lng, status } = body;

        
        if (!serialNo) return new NextResponse("Serial No is required", { status: 400 });
        if (!modelId) return new NextResponse("Model ID is required", { status: 400 });

        
        const model = await prisma.deviceModel.findUnique({ where: { id: modelId } });
        if (!model) return new NextResponse("Invalid Model", { status: 400 });

       
        let payload: any = {
            name,
            serialNo,
            modelId,
        };

        if (isUserMode && user) {
        
            const vefUser = await prisma.user.findUnique({
                where: { id: user },
                select: { id: true }
            });

            if (!vefUser) return new NextResponse("User not found", { status: 404 });

            const parsedLat = lat ? parseFloat(lat) : null;
            const parsedLng = lng ? parseFloat(lng) : null;

            payload = {
                ...payload,
                userId: vefUser.id,
                lat: isNaN(parsedLat!) ? null : parsedLat,
                lng: isNaN(parsedLng!) ? null : parsedLng,
                status: status || DeviceStatus.UNASSIGNED,
                assignedAt: status === DeviceStatus.ASSIGNED ? new Date() : null,
            };
        } else {
            
            payload = {
                ...payload,
                userId: null,
                lat: null,
                lng: null,
                status: DeviceStatus.UNASSIGNED,
                assignedAt: null,
            };
        }

        const updatedDevice = await prisma.device.update({
            where: { id: deviceId },
            data: payload,
        });

        return NextResponse.json(updatedDevice);

    } catch (error) {
        console.error("[DEVICE_PATCH_ERROR]", error);
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