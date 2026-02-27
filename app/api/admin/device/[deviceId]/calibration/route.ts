import { calibrationKey } from "@/constant/Calibration.key";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }) {
    try {

        const { deviceId } = await params.params;

        if (!deviceId) {
            return new NextResponse("Device ID not Found", {
                status: 400
            })
        }

        await adminGuard();

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const limit = Number(searchParams.get("limit")) || 10;

        const logs = await prisma.calibration.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: { deviceId: deviceId },
            orderBy: { createdAt: 'desc' }
        });

        const nextCursor = logs.length === limit ? logs[logs.length - 1].id : null;

        return NextResponse.json({ items: logs, nextCursor });

    } catch (error: any) {
        return handleAdminError(error);
    }
}


export async function POST(req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }) {
    try {
        const { deviceId } = await params.params;

        if (!deviceId) {
            return new NextResponse("Device ID not Found", {
                status: 400
            })
        }

        await adminGuard();

        const { newValues, reason } = await req.json();

        if (!newValues) {
            return new NextResponse("Calibration values required", {
                status: 400,
            });
        }

        // Check device exists
        const device = await prisma.device.findUnique({
            where: { id: deviceId },
        });

        if (!device) {
            return new NextResponse("Device not found", { status: 404 });
        }

        // Prevent multiple PENDING calibrations
        const existingPending = await prisma.calibration.findFirst({
            where: {
                deviceId,
                status: "PENDING",
            },
        });

        if (existingPending) {
            return new NextResponse("Pending calibration already exists", {
                status: 409,
            });
        }

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Create calibration record
        const calibration = await prisma.calibration.create({
            data: {
                deviceId,
                newValues,
                previousValues: null,
                status: "PENDING",
                expiresAt,
                effectiveFrom: new Date(),
                reason,
            },
        });

        // Store in Redis
        await redis.set(
            calibrationKey(deviceId),
            JSON.stringify(newValues),
            "EX",
            60 * 60 // 1 hour
        );

        return NextResponse.json(
            {
                success: true,
                calibrationId: calibration.id,
            },
            { status: 201 }
        );

    } catch (error) {
        return handleAdminError(error);
    }
}

