import { prisma } from "@/lib/prisma";
import { getDailyProcessingStages } from "../service/pipeline.service";
import { getMonthRange, getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";

export class ModeratorDeviceRepo {
    async getDeviceById(deviceId: string) {
        const result = await prisma.device.findUnique({
            where: {
                id: deviceId,
            },
            select: {
                id: true,
                name: true,
                serialNo: true,
                status: true,
                lat: true,
                lng: true,
                model: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return result;
    }


    async getForADeviceHeatmapAgg(deviceId: string, startDate: string) {
        const startingDate = new Date(`${startDate}T00:00:00+05:30`);
        const endingDate = new Date(startingDate);
        endingDate.setDate(endingDate.getDate() + 1);

        const start = { "$date": startingDate };
        const end = { "$date": endingDate };

        return prisma.hourlyAggregateReading.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        deviceId: { $oid: deviceId },
                        hourStart: { $gte: start, $lt: end },
                    },
                },
                {
                    $lookup: {
                        from: "Device",
                        localField: "deviceId",
                        foreignField: "_id",
                        as: "deviceDetails"
                    }
                },
                { $unwind: "$deviceDetails" },
                {
                    $addFields: {
                        istDate: { $dateAdd: { startDate: "$hourStart", unit: "minute", amount: 330 } },
                    },
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$istDate" } },
                            hour: { $hour: "$istDate" },
                        },
                        totalCount: { $sum: "$count" },

                        sumAqi: { $sum: "$sumAqi" },
                        sumPm10: { $sum: "$sumPm10" },
                        sumPm25: { $sum: "$sumPm25" },
                        sumSo2: { $sum: "$sumSo2" },
                        sumNo2: { $sum: "$sumNo2" },
                        sumCo2: { $sum: "$sumCo2" },
                        sumCo: { $sum: "$sumCo" },
                        sumO3: { $sum: "$sumO3" },
                        sumNoise: { $sum: "$sumNoise" },
                        sumPM1: { $sum: "$sumPM1" },
                        sumTvoc: { $sum: "$sumTvoc" },
                        sumSmoke: { $sum: "$sumSmoke" },
                        sumMethane: { $sum: "$sumMethane" },
                        sumH2: { $sum: "$sumH2" },
                        sumAmmonia: { $sum: "$sumAmmonia" },
                        sumH2s: { $sum: "$sumH2s" },
                        sumTemperature: { $sum: "$sumTemperature" },
                        sumHumidity: { $sum: "$sumHumidity" },

                        // We count how many documents actually HAD a value for these fields
                        countAqi: { $sum: { $cond: [{ $gt: ["$sumAqi", null] }, 1, 0] } },
                        countPm10: { $sum: { $cond: [{ $gt: ["$sumPm10", null] }, 1, 0] } },
                        countPm25: { $sum: { $cond: [{ $gt: ["$sumPm25", null] }, 1, 0] } },
                        countSo2: { $sum: { $cond: [{ $gt: ["$sumSo2", null] }, 1, 0] } },
                        countNo2: { $sum: { $cond: [{ $gt: ["$sumNo2", null] }, 1, 0] } },
                        countCo2: { $sum: { $cond: [{ $gt: ["$sumCo2", null] }, 1, 0] } },
                        countCo: { $sum: { $cond: [{ $gt: ["$sumCo", null] }, 1, 0] } },
                        countO3: { $sum: { $cond: [{ $gt: ["$sumO3", null] }, 1, 0] } },
                        countNoise: { $sum: { $cond: [{ $gt: ["$sumNoise", null] }, 1, 0] } },
                        countPM1: { $sum: { $cond: [{ $gt: ["$sumPM1", null] }, 1, 0] } },
                        countTvoc: { $sum: { $cond: [{ $gt: ["$sumTvoc", null] }, 1, 0] } },
                        countSmoke: { $sum: { $cond: [{ $gt: ["$sumSmoke", null] }, 1, 0] } },
                        countMethane: { $sum: { $cond: [{ $gt: ["$sumMethane", null] }, 1, 0] } },
                        countH2: { $sum: { $cond: [{ $gt: ["$sumH2", null] }, 1, 0] } },
                        countAmmonia: { $sum: { $cond: [{ $gt: ["$sumAmmonia", null] }, 1, 0] } },
                        countH2s: { $sum: { $cond: [{ $gt: ["$sumH2s", null] }, 1, 0] } },
                        countTemp: { $sum: { $cond: [{ $gt: ["$sumTemperature", null] }, 1, 0] } },
                        countHum: { $sum: { $cond: [{ $gt: ["$sumHumidity", null] }, 1, 0] } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id.date",
                        hour: "$_id.hour",
                        // If count of records with this sensor is 0, return null, else divide
                        aqi: { $cond: [{ $gt: ["$countAqi", 0] }, { $divide: ["$sumAqi", "$totalCount"] }, null] },
                        pm10: { $cond: [{ $gt: ["$countPm10", 0] }, { $divide: ["$sumPm10", "$totalCount"] }, null] },
                        pm25: { $cond: [{ $gt: ["$countPm25", 0] }, { $divide: ["$sumPm25", "$totalCount"] }, null] },
                        so2: { $cond: [{ $gt: ["$countSo2", 0] }, { $divide: ["$sumSo2", "$totalCount"] }, null] },
                        no2: { $cond: [{ $gt: ["$countNo2", 0] }, { $divide: ["$sumNo2", "$totalCount"] }, null] },
                        co2: { $cond: [{ $gt: ["$countCo2", 0] }, { $divide: ["$sumCo2", "$totalCount"] }, null] },
                        co: { $cond: [{ $gt: ["$countCo", 0] }, { $divide: ["$sumCo", "$totalCount"] }, null] },
                        o3: { $cond: [{ $gt: ["$countO3", 0] }, { $divide: ["$sumO3", "$totalCount"] }, null] },
                        noise: { $cond: [{ $gt: ["$countNoise", 0] }, { $divide: ["$sumNoise", "$totalCount"] }, null] },
                        pm1: { $cond: [{ $gt: ["$countPM1", 0] }, { $divide: ["$sumPM1", "$totalCount"] }, null] },
                        tvoc: { $cond: [{ $gt: ["$countTvoc", 0] }, { $divide: ["$sumTvoc", "$totalCount"] }, null] },
                        smoke: { $cond: [{ $gt: ["$countSmoke", 0] }, { $divide: ["$sumSmoke", "$totalCount"] }, null] },
                        methane: { $cond: [{ $gt: ["$countMethane", 0] }, { $divide: ["$sumMethane", "$totalCount"] }, null] },
                        h2: { $cond: [{ $gt: ["$countH2", 0] }, { $divide: ["$sumH2", "$totalCount"] }, null] },
                        ammonia: { $cond: [{ $gt: ["$countAmmonia", 0] }, { $divide: ["$sumAmmonia", "$totalCount"] }, null] },
                        h2s: { $cond: [{ $gt: ["$countH2s", 0] }, { $divide: ["$sumH2s", "$totalCount"] }, null] },
                        temperature: { $cond: [{ $gt: ["$countTemp", 0] }, { $divide: ["$sumTemperature", "$totalCount"] }, null] },
                        humidity: { $cond: [{ $gt: ["$countHum", 0] }, { $divide: ["$sumHumidity", "$totalCount"] }, null] },
                    },
                },
                { $sort: { date: 1, hour: 1 } },
            ],
        });
    }


    async getLatestSensorReadings(deviceId: string) {
        return prisma.latestSensorReading.findUnique({
            where: {
                deviceId
            }
        })
    }

    async findByDay(deviceId: string, dayStart: string) {
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


    async findByWeek(deviceId: string, dateStr: string) {
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

    async findByMonth(deviceId: string, year: number, month: number) {
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

    async findLastCustomeDays(deviceId: string, dateStr: string, days: number) {
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
}