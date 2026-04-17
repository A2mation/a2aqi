
import { DeviceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { handleUserError } from "@/lib/handleRoleError";
import { withAuditContext } from "@/lib/withAuditContext";
import { upsertActiveSubUserService } from "@/domains/subscription/service/subscription.service";
import { userGuard } from "@/lib/userAuth";

export async function GET(
    req: NextRequest,
    params: {
        params: Promise<{ serialNo: string }>
    }) {
    try {

        const { serialNo } = await params.params;

        // console.log(serialNo)

        if (!serialNo) {
            return new NextResponse("Device not found", {
                status: 404
            })
        }

        await userGuard();


        const device = await prisma.device.findUnique({
            where: {
                serialNo: serialNo,
            }, select: {
                status: true,
                model: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        if (!device) {
            return NextResponse.json(
                { message: "Device not found" },
                { status: 404 }
            )
        }

        if (device.status !== DeviceStatus.UNASSIGNED) {
            return NextResponse.json(
                { message: "Device already assigned" },
                { status: 409 }
            )
        }

        return NextResponse.json({
            model: device.model
        })


    } catch (error) {
        handleUserError(error)
    }
}

export async function PATCH(
    req: NextRequest,
    params: {
        params: Promise<{ serialNo: string }>
    }) {

    try {
        const { serialNo } = await params.params;

        // console.log(serialNo)

        if (!serialNo) {
            return new NextResponse("Device not found", {
                status: 404
            })
        }

        const { user } = await userGuard();


        const body = await req.json()
        const { deviceName, lat, long } = body

        // 🔍 Find device
        const existingDevice = await prisma.device.findUnique({
            where: { serialNo },
        })

        if (!existingDevice) {
            return new NextResponse("Device not found", {
                status: 404,
            })
        }

        // Prevent assigning already assigned device
        if (existingDevice.status !== DeviceStatus.UNASSIGNED) {
            return new NextResponse("Device already assigned", {
                status: 409,
            })
        }

        // Assign device to user
        const updatedDevice = await prisma.device.update({
            where: { serialNo },
            data: {
                name: deviceName,
                lat: lat ? parseFloat(lat) : null,
                lng: long ? parseFloat(long) : null,
                userId: user.id,
                status: DeviceStatus.ASSIGNED,
                assignedAt: new Date(),
            },
        })

        // Update Subscription
        await withAuditContext({
            ip: req.headers.get("x-forwarded-for") || "unknown",
            route: "user-free-1year-device-subscription",
            userId: user.id,
            isAdmin: false,
            role: "USER",
        }, async () => {
            const sub = await upsertActiveSubUserService(updatedDevice.id, user.id);

            if (!sub) {
                return NextResponse.json({
                    error: 'Problem Occures in device Subscription',
                })
            }
        })

        // Return device id
        return NextResponse.json({
            id: updatedDevice.id,
            message: "Device assigned successfully",
        })


    } catch (error) {
        handleUserError(error)
    }
}