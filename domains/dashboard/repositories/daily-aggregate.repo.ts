import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";

export class DailyAggregateRepo {
    static async findByDay(deviceId: string, dayStart: string) {
        const date = new Date(dayStart);

        return prisma.dailyAggregateReading.findFirst({
            where: {
                deviceId,
                dayStart: date,
                device: {
                    isActive: true,
                    status: DeviceStatus.ASSIGNED
                }
            },
        });
    }
}