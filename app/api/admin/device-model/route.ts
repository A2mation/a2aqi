import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {

        await adminGuard();


        const deviceModels = await prisma.deviceModel.findMany();

        const response = NextResponse.json(deviceModels);
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;


    } catch (error: any) {
        return handleAdminError(error);
    }
}

export async function POST(request: Request) {
    try {

        await adminGuard();


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

    } catch (error: any) {
        return handleAdminError(error);
    }
}