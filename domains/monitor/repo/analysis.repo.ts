import { DeviceStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getMonthRange, getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";
import { getDailyProcessingStages } from "../service/monitor.pipeline.service";

export class AdvancedAnalysisRepo {

    async getTop5DevicesDetails(monitorId: string) {
        const result = await prisma.monitorDevice.findMany({
            where: {
                monitorId,
                device: {
                    status: DeviceStatus.ASSIGNED
                }
            },
            select: {
                device: {
                    select: {
                        id: true,
                        serialNo: true,
                        loaction: true,
                        model: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            take: 5  //TODO:: Update for infinite devices
        })
        return result;
    }

    async findLast7Days(deviceId: string, dateStr: string) {
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

    async findLast30Days(deviceId: string, year: number, month: number) {
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

    async findLast90Days(deviceId: string, dateStr: string, days: number = 90) {

        const end = new Date(dateStr);
        const start = new Date(dateStr);
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
}