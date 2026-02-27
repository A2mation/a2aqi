import { prisma } from "@/lib/prisma";

export class SensorReadingRepo {
    static async getLatest(deviceId: string) {
        return prisma.latestSensorReading.findFirst({
            where: { deviceId },
            orderBy: { measuredAt: "desc" },
        });
    }

    // Latest 15 mins Data
    static async findRange(deviceId: string, start: Date, end: Date) {
        return prisma.sensorReading.findMany({
            where: {
                deviceId,
                measuredAt: {
                    gte: start,
                    lt: end,
                },
            },
            orderBy: { measuredAt: "asc" },
        });
    }
}
