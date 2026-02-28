import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { userGuard } from "@/lib/userAuth"
import { handleUserError } from "@/lib/handleRoleError"
import { deviceSchema } from "@/components/users-ui/edit/schema/schema"
import { DeviceStatus, DeviceType } from "@prisma/client"

export async function GET(req: Request) {
    try {
        const { user: sessionUser } = await userGuard()

        const { searchParams } = new URL(req.url)
        const deviceId = searchParams.get("deviceId")
        const search = searchParams.get("search");
        const type = searchParams.get("type");


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
                    type: true,
                    assignedAt: true,
                    isActive: true,
                    loaction: true,
                    serialNo: true
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

export async function PATCH(
    req: Request,
) {
    try {
        const { user: sessionUser } = await userGuard()
        const body = await req.json();

        const { searchParams } = new URL(req.url);
        const deviceId = searchParams.get("deviceId");

        if (!deviceId) {
            return new NextResponse("Device ID is required", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            select: { id: true },
        })

        if (!user) {
            throw new Error("Unauthorized");
        }

        const validatedData = deviceSchema.parse(body);

        const device = await prisma.device.update({
            where: {
                id: deviceId,
                userId: sessionUser.id,
                serialNo: validatedData.serialNo,
                status: DeviceStatus.ASSIGNED
            },
            data: {
                name: validatedData.name,
                type: validatedData.type as DeviceType,
                loaction: validatedData.loaction,
                lat: parseFloat(validatedData.lat),
                lng: parseFloat(validatedData.lng),
            },
        });

        if (!device) {
            throw new Error("Unauthorized");
        }

        return NextResponse.json(device);
    } catch (error: any) {
        console.error("[DEVICE_PATCH]", error);

        if (error.name === "ZodError") {
            return new NextResponse(JSON.stringify(error.errors), { status: 400 });
        }

        return handleUserError(error)
    }
}