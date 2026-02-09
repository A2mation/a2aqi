import { NextResponse } from "next/server";

import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {

        // TODO: Authenticate user and check if they have permission to access device models

        const deviceModels = await prisma.deviceModel.findMany();

        return NextResponse.json(deviceModels);


    } catch (error) {
        return new NextResponse("Failed to fetch device models", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {

        // TODO: Authenticate ADMIN and check if they have permission to create device models
        // const session = await getAuthSession();
        // if (!session) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const { name } = await request.json();

        if (!name) {
            return new NextResponse("Name and manufacturer are required", { status: 400 });
        }

        const newDeviceModel = await prisma.deviceModel.create({
            data: {
                name,
            },
        });

        return NextResponse.json(newDeviceModel, { status: 201 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}