import { DeviceStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getMonthRange, getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";


export async function findByDay(deviceId: string, dayStart: string) {
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

export async function findByWeek(deviceId: string, dateStr: string) {
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

export async function findByMonth(deviceId: string, year: number, month: number) {
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

export async function findLast90Days(deviceId: string, dateStr: string) {
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