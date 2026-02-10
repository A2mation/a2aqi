import { NextResponse } from "next/server";

import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

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

        const { name, description, manufacturer } = await request.json();

        if (!name) {
            return new NextResponse("Name and manufacturer are required", { status: 400 });
        }

        const newDeviceModel = await prisma.deviceModel.create({
            data: {
                name,
                description,
                manufacturer
            },
        });

        return NextResponse.json(newDeviceModel, { status: 201 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}