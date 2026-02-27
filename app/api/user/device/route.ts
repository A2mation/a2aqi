import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { userGuard } from "@/lib/userAuth"
import { handleUserError } from "@/lib/handleRoleError"
import { DeviceType } from "@prisma/client"

export async function GET(req: Request) {
    try {
        const { user: sessionUser } = await userGuard()

        const { searchParams } = new URL(req.url)
        const deviceId = searchParams.get("deviceId")
        const search = searchParams.get("search");
        const type = searchParams.get("type");

        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            select: { id: true },
        })

        if (!user) {
            return new NextResponse("Unauthorized User", {
                status: 401,
            })
        }


        if (deviceId) {
            const device = await prisma.device.findFirst({
                where: {
                    id: deviceId,
                    userId: sessionUser.id,
                },
                select: {
                    id: true,
                    name: true,
                    lat: true,
                    lng: true,
                    assignedAt: true
                },
            })

            if (!device) {
                return new NextResponse("Device not found", {
                    status: 404,
                })
            }

            return NextResponse.json(device)
        }

        const where: any = {
            userId: sessionUser.id,
        };



        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { serialNo: { contains: search, mode: 'insensitive' } },
            ];
        }


        const devices = await prisma.device.findMany({
            where: where,
            select: {
                id: true,
                name: true,
                serialNo: true,
                isActive: true,
                type: true,
                loaction: true,
                status: true,
                lat: true,
                lng: true,
                assignedAt: true,
                createdAt: true,
                model: {
                    select: { name: true }
                },
                user: {
                    select: { email: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(devices)
    } catch (error) {
        return handleUserError(error)
    }
}