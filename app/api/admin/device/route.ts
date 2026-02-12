import { NextResponse } from "next/server";

import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

export async function GET() {
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

        const device = await prisma.device.findMany();

        return NextResponse.json(device);


    } catch (error) {
        return new NextResponse("Failed to fetch device", { status: 500 });
    }
}

export async function POST(request: Request) {
    // Admin Registration Pannel for device Registration
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
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}