/**
 * Common pipeline stages for aqiINDIA data processing
 * This handles Device lookup, IST conversion, and Daily Average calculations
 */
export const getDailyProcessingStages = () => {
    return [
        {
            $lookup: {
                from: "Device",
                localField: "deviceId",
                foreignField: "_id",
                as: "deviceDetails",
            },
        },
        { $unwind: "$deviceDetails" },
        {
            $match: {
                "deviceDetails.isActive": true,
                "deviceDetails.status": "ASSIGNED",
            },
        },
        {
            $addFields: {
                istDate: {
                    $dateAdd: {
                        startDate: "$dayStart",
                        unit: "minute",
                        amount: 330,
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                date: {
                    $dateToString: { format: "%Y-%m-%d", date: "$istDate" },
                },
                aqi: { $divide: ["$sumAqi", "$count"] },
                pm10: { $divide: ["$sumPm10", "$count"] },
                pm25: { $divide: ["$sumPm25", "$count"] },
                so2: { $divide: ["$sumSo2", "$count"] },
                no2: { $divide: ["$sumNo2", "$count"] },
                co2: { $divide: ["$sumCo2", "$count"] },
                co: { $divide: ["$sumCo", "$count"] },
                o3: { $divide: ["$sumO3", "$count"] },
                noise: { $divide: ["$sumNoise", "$count"] },
                pm1: { $divide: ["$sumPM1", "$count"] },
                tvoc: { $divide: ["$sumTvoc", "$count"] },
                smoke: { $divide: ["$sumSmoke", "$count"] },
                methane: { $divide: ["$sumMethane", "$count"] },
                h2: { $divide: ["$sumH2", "$count"] },
                ammonia: { $divide: ["$sumAmmonia", "$count"] },
                h2s: { $divide: ["$sumH2s", "$count"] },
                temperature: { $divide: ["$sumTemperature", "$count"] },
                humidity: { $divide: ["$sumHumidity", "$count"] },
            },
        },
        { $sort: { date: 1 } },
    ];
};