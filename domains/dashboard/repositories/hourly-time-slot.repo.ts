import { prisma } from "@/lib/prisma";

export class HourlyTimeSlotRepository {
    async getHourlyTimeSlotAggregates(deviceId: string, start: Date, end: Date) {
        return prisma.hourlyAggregateReading.findMany({
            where: {
                deviceId,
                hourStart: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: {
                hourStart: "asc",
            },
        });
    }
}
