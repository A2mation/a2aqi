export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { DeviceStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { deviceFormSchema } from "@/lib/validation/admin/Device";

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

        const validation = deviceFormSchema.safeParse(body);
        
        if (!validation.success) {
            console.log(validation.error)
            return NextResponse.json(
                {
                    message: "Validation Error",
                    errors: validation.error
                },
                { status: 400 }
            );
        }

        const { name, user, isUserMode, serialNo, modelId, lat, lng, status, assignedAt, state } = validation.data;

        const model = await prisma.deviceModel.findUnique({ where: { id: modelId } });

        if (!model) return new NextResponse("Invalid Model", { status: 400 });


        let payload: any = {
            name,
            serialNo,
            modelId,
            state,
            isActive: state === 'APPROVED' ? true : false
        };

        const currentDevice = await prisma.device.findUnique({
            where: { id: deviceId },
            select: { status: true, assignedAt: true }
        });

        const isTransitioningToAssigned =
            status === DeviceStatus.ASSIGNED &&
            currentDevice?.status !== DeviceStatus.ASSIGNED;

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
                assignedAt: isTransitioningToAssigned
                    ? assignedAt
                    : status === DeviceStatus.ASSIGNED
                        ? currentDevice?.assignedAt
                        : null,
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

        await prisma.$transaction(async (tx) => {
            await tx.sensorReading.deleteMany({ where: { deviceId } });
            await tx.hourlyAggregateReading.deleteMany({ where: { deviceId } });
            await tx.dailyAggregateReading.deleteMany({ where: { deviceId } });
            await tx.payment.deleteMany({ where: { deviceId } });
            await tx.couponRedemption.deleteMany({ where: { deviceId } });
            await tx.deviceSubscription.deleteMany({ where: { deviceId } });
            await tx.exportLog.deleteMany({ where: { deviceId } });
            await tx.calibration.deleteMany({ where: { deviceId } });
            await tx.latestSensorReading.deleteMany({ where: { deviceId } });
            await tx.device.delete({ where: { id: deviceId } });
        });



        return new NextResponse("Device deleted successfully", { status: 200 });
    } catch (error) {
        return handleAdminError(error);
    }
}