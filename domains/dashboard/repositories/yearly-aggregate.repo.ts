import { prisma } from "@/lib/prisma";

export class YearlyAggregateRepo {
    static async findByYear(deviceId: string, year: number) {
        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year + 1, 0, 1));

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
