import { prisma } from "@/lib/prisma";
import { getMonthRange } from "../utils/date-bucket.util";
import { DeviceStatus } from "@prisma/client";

export class MonthlyAggregateRepo {
    static async findByMonth(deviceId: string, year: number, month: number) {

        const {
            start,
            end
        } = getMonthRange(year, month);

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
