import { prisma } from "@/lib/prisma";
import { getWeekRange } from "../utils/date-bucket.util";
import { DeviceStatus } from "@prisma/client";

export class WeeklyAggregateRepo {
    static async findByWeek(deviceId: string, dateStr: string) {
        const { start, end } = getWeekRange(dateStr);

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
            orderBy: { dayStart: "asc" },
        });
    }
}
