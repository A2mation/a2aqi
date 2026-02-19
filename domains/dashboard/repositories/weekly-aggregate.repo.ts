import { prisma } from "@/lib/prisma";
import { getWeekRange } from "../utils/date-bucket.util";

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
            },
            orderBy: { dayStart: "asc" },
        });
    }
}
