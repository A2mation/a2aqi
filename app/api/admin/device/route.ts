import { NextResponse } from "next/server";

import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {

        await adminGuard()

        const device = await prisma.device.findMany();

        const response = NextResponse.json(device);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;

    } catch (error) {
        return handleAdminError(error);
    }
}

export async function POST(request: Request) {
    // Admin Registration Pannel for device Registration
    try {

        await adminGuard()

        const { name, serialNo, modelId, apiKey }: {
            name: string,
            serialNo: string,
            modelId: string,
            apiKey: string

        } = await request.json();

        if (!serialNo) {
            return new NextResponse("Serial No is required", { status: 400 });
        }

        if (!apiKey) {
            return new NextResponse("ApiKey is required", { status: 400 });
        }

        const model = await prisma.deviceModel.findUnique({
            where: {
                id: modelId
            }
        })

        if (!model) {
            return new NextResponse("Invalid Model", { status: 400 })
        }

        const newDeviceModel = await prisma.device.create({
            data: {
                name,
                apiKey,
                serialNo,
                modelId,
            },
        });


        return NextResponse.json(newDeviceModel, { status: 201 });

    } catch (error) {
        return handleAdminError(error);
    }
}

export async function DELETE(request: Request) {
    try {

        await adminGuard();

        const { searchParams } = new URL(request.url);
        const deviceId = searchParams.get('id');

        if (!deviceId) {
            return new NextResponse("Device ID is required", { status: 400 });
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
        });


        return NextResponse.json({
            message: "Device deleted successfully"
        });


    } catch (error) {
        return handleAdminError(error);
    }
}