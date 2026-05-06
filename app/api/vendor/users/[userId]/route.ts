import { prisma } from "@/lib/prisma";
import { vendorGuard } from "@/lib/vendorAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request,
    params: {
        params: Promise<{ userId: string }>
    }
) {
    try {

        const { userId } = await params.params

        if (!userId) {
            return NextResponse.json(
                { message: "User Id not Present", error: true },
                { status: 400 }
            );
        }

        const { vendor } = await vendorGuard();

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                creatorId: vendor.id
            }, select: {
                id: true,
                name: true,
                email: true,
                organizationName: true,
                accountType: true,
                phoneNumber: true,
                status: true,
                gstNumber: true,
                createdAt: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found", error: true },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}
