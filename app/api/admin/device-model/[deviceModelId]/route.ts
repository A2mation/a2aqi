import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth";
import { ROLE } from "@/types/type";

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

        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.ADMIN) {
            return new NextResponse("ADMIN ACCESS ONLY ROUTE", {
                status: 401
            })
        }

        const admin = await prisma.admin.findUnique({
            where: {
                id: session.user.id
            }
        })

        if (!admin) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

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

        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.ADMIN) {
            return new NextResponse("ADMIN ACCESS ONLY ROUTE", {
                status: 401
            })
        }

        const admin = await prisma.admin.findUnique({
            where: {
                id: session.user.id
            }
        })

        if (!admin) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

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