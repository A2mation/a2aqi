import { HourlyAggregateRepo } from "../repositories/hourly-aggregate.repo";
import { safeAvg } from "../utils/average.util";

export class HourlyAggregationService {
    static async getHourly(deviceId: string, date: string) {
        const records = await HourlyAggregateRepo.findByDate(deviceId, date);

        return records.map((record) => {
            const count = record.count || 1;

            return {
                hourStart: record.hourStart,
                count: record.count,

                // AQI
                avgAqi: safeAvg(record.sumAqi, count),
                minAqi: record.minAqi ?? null,
                maxAqi: record.maxAqi ?? null,

                // PM10
                avgPm10: safeAvg(record.sumPm10, count),
                minPm10: record.minPm10 ?? null,
                maxPm10: record.maxPm10 ?? null,

                // PM2.5
                avgPm25: safeAvg(record.sumPm25, count),
                minPm25: record.minPm25 ?? null,
                maxPm25: record.maxPm25 ?? null,

                // SO2
                avgSo2: safeAvg(record.sumSo2, count),
                minSo2: record.minSo2 ?? null,
                maxSo2: record.maxSo2 ?? null,

                // NO2
                avgNo2: safeAvg(record.sumNo2, count),
                minNo2: record.minNo2 ?? null,
                maxNo2: record.maxNo2 ?? null,

                // CO2
                avgCo2: safeAvg(record.sumCo2, count),
                minCo2: record.minCo2 ?? null,
                maxCo2: record.maxCo2 ?? null,

                // CO
                avgCo: safeAvg(record.sumCo, count),
                minCo: record.minCo ?? null,
                maxCo: record.maxCo ?? null,

                // O3
                avgO3: safeAvg(record.sumO3, count),
                minO3: record.minO3 ?? null,
                maxO3: record.maxO3 ?? null,

                // Noise
                avgNoise: safeAvg(record.sumNoise, count),
                minNoise: record.minNoise ?? null,
                maxNoise: record.maxNoise ?? null,

                // PM1
                avgPM1: safeAvg(record.sumPM1, count),
                minPM1: record.minPM1 ?? null,
                maxPM1: record.maxPM1 ?? null,

                // TVOC
                avgTvoc: safeAvg(record.sumTvoc, count),
                minTvoc: record.minTvoc ?? null,
                maxTvoc: record.maxTvoc ?? null,

                // Smoke
                avgSmoke: safeAvg(record.sumSmoke, count),
                minSmoke: record.minSmoke ?? null,
                maxSmoke: record.maxSmoke ?? null,

                // Methane
                avgMethane: safeAvg(record.sumMethane, count),
                minMethane: record.minMethane ?? null,
                maxMethane: record.maxMethane ?? null,

                // H2
                avgH2: safeAvg(record.sumH2, count),
                minH2: record.minH2 ?? null,
                maxH2: record.maxH2 ?? null,

                // Ammonia
                avgAmmonia: safeAvg(record.sumAmmonia, count),
                minAmmonia: record.minAmmonia ?? null,
                maxAmmonia: record.maxAmmonia ?? null,

                // H2S
                avgH2s: safeAvg(record.sumH2s, count),
                minH2s: record.minH2s ?? null,
                maxH2s: record.maxH2s ?? null,

                // Weather: Temperature
                avgTemperature: safeAvg(record.sumTemperature, count),
                minTemperature: record.minTemperature ?? null,
                maxTemperature: record.maxTemperature ?? null,

                // Weather: Humidity
                avgHumidity: safeAvg(record.sumHumidity, count),
                minHumidity: record.minHumidity ?? null,
                maxHumidity: record.maxHumidity ?? null,
            };
        });
    }
}
