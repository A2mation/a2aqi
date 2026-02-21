import { getAuthSession } from "@/auth";
import { ROLE } from "@/types/type";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const session = await getAuthSession();

        if (!session || session.user.role !== ROLE.USER) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }, select: {
                id: true,
                email: true
            }
        })

        if (!user) {
            return new NextResponse("Unauthorized User", {
                status: 401
            })
        }

        const deviceModel = await prisma.deviceModel.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        return NextResponse.json({
            models: deviceModel
        });

    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", {
            status: 500
        });
    }
}