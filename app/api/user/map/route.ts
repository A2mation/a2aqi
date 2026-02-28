import { handleUserError } from "@/lib/handleRoleError";
import { userGuard } from "@/lib/userAuth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { user: sessionUser } = await userGuard();

        const devices = await prisma.device.findMany({
            where: {
                userId: sessionUser.id,
            },
            select: {
                id: true,
                name: true,
                lat: true,
                lng: true,
                latestSensorReadings: {
                    select: {
                        aqi: true,
                    }
                }
            }
        });

        const formattedData = devices.map((device) => ({
            id: device.id,
            name: device.name,
            lat: Number(device.lat),
            lng: Number(device.lng),
            aqi: device.latestSensorReadings?.aqi ?? 0,
        }));

        return NextResponse.json(formattedData);

    } catch (error) {
        // Correctly catches Auth errors from userGuard or DB errors
        return handleUserError(error);
    }
}