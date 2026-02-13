import { NextResponse } from "next/server";

import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET() {
    try {

        await adminGuard()

        const device = await prisma.device.findMany();

        return NextResponse.json(device);


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