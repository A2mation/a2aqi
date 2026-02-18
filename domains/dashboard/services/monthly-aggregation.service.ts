import { MonthlyAggregateRepo } from "../repositories/monthly-aggregate.repo";
import { discardNullFields, safeAvg } from "../utils/average.util";

export class MonthlyAggregationService {
    static async getMonthly(deviceId: string, year: number, month: number) {
        const records = await MonthlyAggregateRepo.findByMonth(deviceId, year, month);

        return records.map((record) => {
            const count = record.count || 1;

            const result = {
                dayStart: record.dayStart,
                count: record.count,

                avgAqi: safeAvg(record.sumAqi, count),
                minAqi: record.minAqi ?? null,
                maxAqi: record.maxAqi ?? null,

                avgPm10: safeAvg(record.sumPm10, count),
                minPm10: record.minPm10 ?? null,
                maxPm10: record.maxPm10 ?? null,

                avgPm25: safeAvg(record.sumPm25, count),
                minPm25: record.minPm25 ?? null,
                maxPm25: record.maxPm25 ?? null,

                avgSo2: safeAvg(record.sumSo2, count),
                minSo2: record.minSo2 ?? null,
                maxSo2: record.maxSo2 ?? null,

                avgNo2: safeAvg(record.sumNo2, count),
                minNo2: record.minNo2 ?? null,
                maxNo2: record.maxNo2 ?? null,

                avgCo2: safeAvg(record.sumCo2, count),
                minCo2: record.minCo2 ?? null,
                maxCo2: record.maxCo2 ?? null,

                avgCo: safeAvg(record.sumCo, count),
                minCo: record.minCo ?? null,
                maxCo: record.maxCo ?? null,

                avgO3: safeAvg(record.sumO3, count),
                minO3: record.minO3 ?? null,
                maxO3: record.maxO3 ?? null,

                avgNoise: safeAvg(record.sumNoise, count),
                minNoise: record.minNoise ?? null,
                maxNoise: record.maxNoise ?? null,

                avgPM1: safeAvg(record.sumPM1, count),
                minPM1: record.minPM1 ?? null,
                maxPM1: record.maxPM1 ?? null,

                avgTvoc: safeAvg(record.sumTvoc, count),
                minTvoc: record.minTvoc ?? null,
                maxTvoc: record.maxTvoc ?? null,

                avgSmoke: safeAvg(record.sumSmoke, count),
                minSmoke: record.minSmoke ?? null,
                maxSmoke: record.maxSmoke ?? null,

                avgMethane: safeAvg(record.sumMethane, count),
                minMethane: record.minMethane ?? null,
                maxMethane: record.maxMethane ?? null,

                avgH2: safeAvg(record.sumH2, count),
                minH2: record.minH2 ?? null,
                maxH2: record.maxH2 ?? null,

                avgAmmonia: safeAvg(record.sumAmmonia, count),
                minAmmonia: record.minAmmonia ?? null,
                maxAmmonia: record.maxAmmonia ?? null,

                avgH2s: safeAvg(record.sumH2s, count),
                minH2s: record.minH2s ?? null,
                maxH2s: record.maxH2s ?? null,

                avgTemperature: safeAvg(record.sumTemperature, count),
                minTemperature: record.minTemperature ?? null,
                maxTemperature: record.maxTemperature ?? null,

                avgHumidity: safeAvg(record.sumHumidity, count),
                minHumidity: record.minHumidity ?? null,
                maxHumidity: record.maxHumidity ?? null,
            };

            return discardNullFields(result);
        });
    }
}
