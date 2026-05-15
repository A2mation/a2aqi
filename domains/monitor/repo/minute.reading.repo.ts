import { prisma } from "@/lib/prisma";

export async function getLast1HourMinuteDataRepo(deviceId: string) {
    return await prisma.sensorReading.findMany({
        where: {
            deviceId,
        },
        orderBy: {
            measuredAt: 'desc'
        },
        take: 50
    });
}