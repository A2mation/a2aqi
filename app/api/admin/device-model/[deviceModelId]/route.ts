import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }) {
    try {
        const { deviceModelId } = await params.params;

        if (!deviceModelId) {
            return new NextResponse("Device Model ID not Found", {
                status: 400
            })
        }

        const deviceModel = await prisma.deviceModel.findUnique({
            where: {
                id: deviceModelId
            }
        })

        if (!deviceModel) {
            return new NextResponse("Device Model not found", { status: 404 });
        }

        return NextResponse.json(deviceModel);

    } catch (error) {
        return new NextResponse("Failed to fetch device model", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }
) {
    try {
        const { deviceModelId } = await params.params;
        if (!deviceModelId) {
            return new NextResponse("Device Model ID not Found", {
                status: 400
            })
        }

        const {
            name
        }: {
            name: string
        } = await req.json();

        const updatedDeviceModel = await prisma.deviceModel.update({
            where: {
                id: deviceModelId
            },
            data: {
                name
            }
        })

        if (!updatedDeviceModel) {
            return new NextResponse("Device Model not found", { status: 404 });
        }

        return NextResponse.json(updatedDeviceModel);


    } catch (error) {
        return new NextResponse("Failed to update device model", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }
) {
    try {

        // Admin authentication
        const { deviceModelId } = await params.params;
        if (!deviceModelId) {
            return new NextResponse("Device Model ID not Found", {
                status: 400
            })
        }

        const res = await prisma.deviceModel.delete({
            where: {
                id: deviceModelId
            }
        })

        if (!res) {
            return new NextResponse("Device Model not found", { status: 404 });
        }

        return new NextResponse("Device Model deleted successfully", { status: 200 });
    } catch (error) {
        return new NextResponse("Failed to delete device model", { status: 500 });
    }
}