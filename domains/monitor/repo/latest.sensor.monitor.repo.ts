import { prisma } from "@/lib/prisma";

export async function getLatestSensorReadings(deviceId: string) {
    return prisma.latestSensorReading.findUnique({
        where :{
            deviceId
        }
    })
}