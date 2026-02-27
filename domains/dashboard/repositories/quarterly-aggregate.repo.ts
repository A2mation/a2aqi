import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";

export class QuarterlyAggregateRepo {
    static async findLast90Days(deviceId: string, dateStr: string) {
        const end = new Date(`${dateStr}T00:00:00.000Z`);
        const start = new Date(end);
        start.setUTCDate(start.getUTCDate() - 90);

        return prisma.dailyAggregateReading.findMany({
            where: {
                deviceId,
                dayStart: {
                    gte: start,
                    lt: end,
                },
                device: {
                    isActive: true,
                    status: DeviceStatus.ASSIGNED
                }
            },
            orderBy: {
                dayStart: "asc",
            },
        });
    }
}
