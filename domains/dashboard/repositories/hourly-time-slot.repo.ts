import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";

export class HourlyTimeSlotRepository {
    async getHourlyTimeSlotAggregates(deviceId: string, start: Date, end: Date) {
        return prisma.hourlyAggregateReading.findMany({
            where: {
                deviceId,
                hourStart: {
                    gte: start,
                    lte: end,
                },
                device: {
                    isActive: true,
                    status: DeviceStatus.ASSIGNED
                }
            },
            orderBy: {
                hourStart: "asc",
            },
        });
    }
}
