import { prisma } from "@/lib/prisma";

export class MonthlyAggregateRepo {
    static async findByMonth(deviceId: string, year: number, month: number) {
        const start = new Date(Date.UTC(year, month - 1, 1));
        const end = new Date(Date.UTC(year, month, 1));

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
