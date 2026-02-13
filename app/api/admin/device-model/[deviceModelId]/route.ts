import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { ROLE } from "@/types/type";

export async function GET(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }) {
    try {
        await adminGuard();

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

    } catch (err: any) {
        return handleAdminError(err);
    }

}

export async function PATCH(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }
): Promise<NextResponse> {
    try {

        await adminGuard();

        const { deviceModelId } = await params.params;
        if (!deviceModelId) {
            return new NextResponse("Device Model ID not Found", {
                status: 400
            })
        }

        const {
            name,
            description,
            isActive
        } = await req.json();

        const updatedDeviceModel = await prisma.deviceModel.update({
            where: {
                id: deviceModelId
            },
            data: {
                name,
                description,
                isActive
            }
        })

        if (!updatedDeviceModel) {
            return new NextResponse("Device Model not found", { status: 404 });
        }

        return NextResponse.json(updatedDeviceModel);


    } catch (err: any) {
        return handleAdminError(err);
    }

}

export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ deviceModelId: string }>
    }
) {
    try {

        await adminGuard();

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
    } catch (err: any) {
        return handleAdminError(err);
    }

}