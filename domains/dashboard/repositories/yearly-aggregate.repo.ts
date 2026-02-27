import { prisma } from "@/lib/prisma";

import { getYearRange } from "../utils/date-bucket.util";
import { DeviceStatus } from "@prisma/client";

export class YearlyAggregateRepo {
    static async findByYear(deviceId: string, year: number) {

        const {
            start,
            end
        } = getYearRange(year);

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
