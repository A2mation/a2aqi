import { prisma } from "@/lib/prisma";
import { vendorGuard } from "@/lib/vendorAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const models = await prisma.deviceModel.findMany({
            where: {
                name: {
                    startsWith: 'VN-',
                    mode: 'insensitive',
                },
            },
            select:{
                id: true,
                name: true,
                parameters: true
            }
        });
        return NextResponse.json(
            models,
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}