import { MonthlyAggregateRepo } from "../repositories/monthly-aggregate.repo";

export class MonthlyAggregationService {
    static async getMonthly(deviceId: string, year: number, month: number) {
        const records = await MonthlyAggregateRepo.findByMonth(deviceId, year, month);

        return records.map((record) => {
            const count = record.count || 1;

            return {
                dayStart: record.dayStart,
                count: record.count,

                // AQI
                avgAqi: record.sumAqi ? record.sumAqi / count : null,
                minAqi: record.minAqi ?? null,
                maxAqi: record.maxAqi ?? null,

                // PM10
                avgPm10: record.sumPm10 ? record.sumPm10 / count : null,
                minPm10: record.minPm10 ?? null,
                maxPm10: record.maxPm10 ?? null,

                // PM2.5
                avgPm25: record.sumPm25 ? record.sumPm25 / count : null,
                minPm25: record.minPm25 ?? null,
                maxPm25: record.maxPm25 ?? null,

                // SO2
                avgSo2: record.sumSo2 ? record.sumSo2 / count : null,
                minSo2: record.minSo2 ?? null,
                maxSo2: record.maxSo2 ?? null,

                // NO2
                avgNo2: record.sumNo2 ? record.sumNo2 / count : null,
                minNo2: record.minNo2 ?? null,
                maxNo2: record.maxNo2 ?? null,

                // CO2
                avgCo2: record.sumCo2 ? record.sumCo2 / count : null,
                minCo2: record.minCo2 ?? null,
                maxCo2: record.maxCo2 ?? null,

                // CO
                avgCo: record.sumCo ? record.sumCo / count : null,
                minCo: record.minCo ?? null,
                maxCo: record.maxCo ?? null,

                // O3
                avgO3: record.sumO3 ? record.sumO3 / count : null,
                minO3: record.minO3 ?? null,
                maxO3: record.maxO3 ?? null,

                // Noise
                avgNoise: record.sumNoise ? record.sumNoise / count : null,
                minNoise: record.minNoise ?? null,
                maxNoise: record.maxNoise ?? null,

                // PM1
                avgPM1: record.sumPM1 ? record.sumPM1 / count : null,
                minPM1: record.minPM1 ?? null,
                maxPM1: record.maxPM1 ?? null,

                // TVOC
                avgTvoc: record.sumTvoc ? record.sumTvoc / count : null,
                minTvoc: record.minTvoc ?? null,
                maxTvoc: record.maxTvoc ?? null,

                // Smoke
                avgSmoke: record.sumSmoke ? record.sumSmoke / count : null,
                minSmoke: record.minSmoke ?? null,
                maxSmoke: record.maxSmoke ?? null,

                // Methane
                avgMethane: record.sumMethane ? record.sumMethane / count : null,
                minMethane: record.minMethane ?? null,
                maxMethane: record.maxMethane ?? null,

                // H2
                avgH2: record.sumH2 ? record.sumH2 / count : null,
                minH2: record.minH2 ?? null,
                maxH2: record.maxH2 ?? null,

                // Ammonia
                avgAmmonia: record.sumAmmonia ? record.sumAmmonia / count : null,
                minAmmonia: record.minAmmonia ?? null,
                maxAmmonia: record.maxAmmonia ?? null,

                // H2S
                avgH2s: record.sumH2s ? record.sumH2s / count : null,
                minH2s: record.minH2s ?? null,
                maxH2s: record.maxH2s ?? null,

                // Weather: Temperature
                avgTemperature: record.sumTemperature
                    ? record.sumTemperature / count
                    : null,
                minTemperature: record.minTemperature ?? null,
                maxTemperature: record.maxTemperature ?? null,

                // Weather: Humidity
                avgHumidity: record.sumHumidity ? record.sumHumidity / count : null,
                minHumidity: record.minHumidity ?? null,
                maxHumidity: record.maxHumidity ?? null,
            };
        });
    }
}
