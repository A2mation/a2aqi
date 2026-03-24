import { prisma } from "@/lib/prisma";

export async function getHeatmapAgg(deviceId: string, startDate: string) {
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
                    hourStart: {
                        $gte: start,
                        $lt: end,
                    },
                },
            },

            // convert to IST
            {
                $addFields: {
                    istDate: {
                        $dateAdd: {
                            startDate: "$hourStart",
                            unit: "minute",
                            amount: 330,
                        },
                    },
                },
            },

            {
                $addFields: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$istDate",
                        },
                    },
                    hour: {
                        $hour: "$istDate",
                    },
                },
            },

            {
                $group: {
                    _id: {
                        date: "$date",
                        hour: "$hour",
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
                },
            },

            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    hour: "$_id.hour",

                    aqi: {
                        $cond: [
                            { $eq: ["$totalCount", 0] },
                            null,
                            { $divide: ["$sumAqi", "$totalCount"] },
                        ],
                    },

                    pm10: { $divide: ["$sumPm10", "$totalCount"] },
                    pm25: { $divide: ["$sumPm25", "$totalCount"] },
                    so2: { $divide: ["$sumSo2", "$totalCount"] },
                    no2: { $divide: ["$sumNo2", "$totalCount"] },
                    co2: { $divide: ["$sumCo2", "$totalCount"] },
                    co: { $divide: ["$sumCo", "$totalCount"] },
                    o3: { $divide: ["$sumO3", "$totalCount"] },
                    noise: { $divide: ["$sumNoise", "$totalCount"] },
                    pm1: { $divide: ["$sumPM1", "$totalCount"] },
                    tvoc: { $divide: ["$sumTvoc", "$totalCount"] },
                    smoke: { $divide: ["$sumSmoke", "$totalCount"] },
                    methane: { $divide: ["$sumMethane", "$totalCount"] },
                    h2: { $divide: ["$sumH2", "$totalCount"] },
                    ammonia: { $divide: ["$sumAmmonia", "$totalCount"] },
                    h2s: { $divide: ["$sumH2s", "$totalCount"] },
                    temperature: { $divide: ["$sumTemperature", "$totalCount"] },
                    humidity: { $divide: ["$sumHumidity", "$totalCount"] },
                },
            },

            {
                $sort: {
                    date: 1,
                    hour: 1,
                },
            },
        ],
    });
}