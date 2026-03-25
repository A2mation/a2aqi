import { DeviceStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getMonthRange, getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";
import { getDailyProcessingStages } from "../service/monitor.pipeline.service";


export async function findByDay(deviceId: string, dayStart: string) {
    const date = new Date(dayStart);

    return prisma.dailyAggregateReading.aggregateRaw({
        pipeline: [
            {
                $match: {
                    deviceId: { $oid: deviceId },
                    dayStart: {
                        $eq: { "$date": dayStart },
                    },
                },
            },
            ...getDailyProcessingStages()
        ]
    });
}

export async function findByWeek(deviceId: string, dateStr: string) {
    const { start, end } = getWeekRange(dateStr);

    return prisma.dailyAggregateReading.aggregateRaw({
        pipeline: [
            {
                $match: {
                    deviceId: { $oid: deviceId },
                    dayStart: {
                        $gte: { "$date": start },
                        $lt: { "$date": end },
                    },
                },
            },
            ...getDailyProcessingStages()
        ]
    });
}

export async function findByMonth(deviceId: string, year: number, month: number) {
    const {
        start,
        end
    } = getMonthRange(year, month);

    return prisma.dailyAggregateReading.aggregateRaw({
        pipeline: [
            {
                $match: {
                    deviceId: { $oid: deviceId },
                    dayStart: {
                        $gte: { "$date": start },
                        $lt: { "$date": end },
                    },
                },
            },
            ...getDailyProcessingStages()
        ]
    });
}

export async function findLastCustomeDays(deviceId: string, dateStr: string, days: number) {
    const end = new Date(`${dateStr}T00:00:00.000Z`);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - days);

    return prisma.dailyAggregateReading.aggregateRaw({
        pipeline: [
            {
                $match: {
                    deviceId: { $oid: deviceId },
                    dayStart: {
                        $gte: { "$date": start },
                        $lt: { "$date": end },
                    },
                },
            },
            ...getDailyProcessingStages()
        ]
    });
}