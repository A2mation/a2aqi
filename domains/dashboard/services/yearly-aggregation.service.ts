import { YearlyAggregateRepo } from "../repositories/yearly-aggregate.repo";
import { safeAvg, updateMax, updateMin } from "../utils/average.util";

export class YearlyAggregationService {
    static async getYearly(deviceId: string, year: number) {
        const records = await YearlyAggregateRepo.findByYear(deviceId, year);

        const grouped: Record<string, any[]> = {};

        for (const record of records) {
            const date = new Date(record.dayStart);

            const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(record);
        }

        return Object.entries(grouped).map(([monthKey, monthRecords]) => {
            let totalCount = 0;

            // SUMS
            let sumAqi = 0;
            let sumPm10 = 0;
            let sumPm25 = 0;
            let sumSo2 = 0;
            let sumNo2 = 0;
            let sumCo2 = 0;
            let sumCo = 0;
            let sumO3 = 0;
            let sumNoise = 0;
            let sumPM1 = 0;
            let sumTvoc = 0;
            let sumSmoke = 0;
            let sumMethane = 0;
            let sumH2 = 0;
            let sumAmmonia = 0;
            let sumH2s = 0;

            let sumTemperature = 0;
            let sumHumidity = 0;

            // MIN/MAX
            let minAqi: number | null = null;
            let maxAqi: number | null = null;

            let minPm10: number | null = null;
            let maxPm10: number | null = null;

            let minPm25: number | null = null;
            let maxPm25: number | null = null;

            let minSo2: number | null = null;
            let maxSo2: number | null = null;

            let minNo2: number | null = null;
            let maxNo2: number | null = null;

            let minCo2: number | null = null;
            let maxCo2: number | null = null;

            let minCo: number | null = null;
            let maxCo: number | null = null;

            let minO3: number | null = null;
            let maxO3: number | null = null;

            let minNoise: number | null = null;
            let maxNoise: number | null = null;

            let minPM1: number | null = null;
            let maxPM1: number | null = null;

            let minTvoc: number | null = null;
            let maxTvoc: number | null = null;

            let minSmoke: number | null = null;
            let maxSmoke: number | null = null;

            let minMethane: number | null = null;
            let maxMethane: number | null = null;

            let minH2: number | null = null;
            let maxH2: number | null = null;

            let minAmmonia: number | null = null;
            let maxAmmonia: number | null = null;

            let minH2s: number | null = null;
            let maxH2s: number | null = null;

            let minTemperature: number | null = null;
            let maxTemperature: number | null = null;

            let minHumidity: number | null = null;
            let maxHumidity: number | null = null;

            // LOOP
            for (const r of monthRecords) {
                totalCount += r.count || 0;

                // SUM
                if (r.sumAqi != null) sumAqi += r.sumAqi;
                if (r.sumPm10 != null) sumPm10 += r.sumPm10;
                if (r.sumPm25 != null) sumPm25 += r.sumPm25;
                if (r.sumSo2 != null) sumSo2 += r.sumSo2;
                if (r.sumNo2 != null) sumNo2 += r.sumNo2;
                if (r.sumCo2 != null) sumCo2 += r.sumCo2;
                if (r.sumCo != null) sumCo += r.sumCo;
                if (r.sumO3 != null) sumO3 += r.sumO3;
                if (r.sumNoise != null) sumNoise += r.sumNoise;
                if (r.sumPM1 != null) sumPM1 += r.sumPM1;
                if (r.sumTvoc != null) sumTvoc += r.sumTvoc;
                if (r.sumSmoke != null) sumSmoke += r.sumSmoke;
                if (r.sumMethane != null) sumMethane += r.sumMethane;
                if (r.sumH2 != null) sumH2 += r.sumH2;
                if (r.sumAmmonia != null) sumAmmonia += r.sumAmmonia;
                if (r.sumH2s != null) sumH2s += r.sumH2s;

                if (r.sumTemperature != null) sumTemperature += r.sumTemperature;
                if (r.sumHumidity != null) sumHumidity += r.sumHumidity;


                // AQI
                minAqi = updateMin(minAqi, r.minAqi);
                maxAqi = updateMax(maxAqi, r.maxAqi);

                // PM10
                minPm10 = updateMin(minPm10, r.minPm10);
                maxPm10 = updateMax(maxPm10, r.maxPm10);

                // PM25
                minPm25 = updateMin(minPm25, r.minPm25);
                maxPm25 = updateMax(maxPm25, r.maxPm25);

                // SO2
                minSo2 = updateMin(minSo2, r.minSo2);
                maxSo2 = updateMax(maxSo2, r.maxSo2);

                // NO2
                minNo2 = updateMin(minNo2, r.minNo2);
                maxNo2 = updateMax(maxNo2, r.maxNo2);

                // CO2
                minCo2 = updateMin(minCo2, r.minCo2);
                maxCo2 = updateMax(maxCo2, r.maxCo2);

                // CO
                minCo = updateMin(minCo, r.minCo);
                maxCo = updateMax(maxCo, r.maxCo);

                // O3
                minO3 = updateMin(minO3, r.minO3);
                maxO3 = updateMax(maxO3, r.maxO3);

                // Noise
                minNoise = updateMin(minNoise, r.minNoise);
                maxNoise = updateMax(maxNoise, r.maxNoise);

                // PM1
                minPM1 = updateMin(minPM1, r.minPM1);
                maxPM1 = updateMax(maxPM1, r.maxPM1);

                // TVOC
                minTvoc = updateMin(minTvoc, r.minTvoc);
                maxTvoc = updateMax(maxTvoc, r.maxTvoc);

                // Smoke
                minSmoke = updateMin(minSmoke, r.minSmoke);
                maxSmoke = updateMax(maxSmoke, r.maxSmoke);

                // Methane
                minMethane = updateMin(minMethane, r.minMethane);
                maxMethane = updateMax(maxMethane, r.maxMethane);

                // H2
                minH2 = updateMin(minH2, r.minH2);
                maxH2 = updateMax(maxH2, r.maxH2);

                // Ammonia
                minAmmonia = updateMin(minAmmonia, r.minAmmonia);
                maxAmmonia = updateMax(maxAmmonia, r.maxAmmonia);

                // H2S
                minH2s = updateMin(minH2s, r.minH2s);
                maxH2s = updateMax(maxH2s, r.maxH2s);

                // Temperature
                minTemperature = updateMin(minTemperature, r.minTemperature);
                maxTemperature = updateMax(maxTemperature, r.maxTemperature);

                // Humidity
                minHumidity = updateMin(minHumidity, r.minHumidity);
                maxHumidity = updateMax(maxHumidity, r.maxHumidity);
            }

            const safeCount = totalCount || 1;
            const monthStart = new Date(`${monthKey}-01T00:00:00.000Z`);

            return {
                monthStart,
                count: totalCount,

                // AQI
                avgAqi: safeAvg(sumAqi, safeCount),
                minAqi,
                maxAqi,

                // PM10
                avgPm10: safeAvg(sumPm10, safeCount),
                minPm10,
                maxPm10,

                // PM2.5
                avgPm25: safeAvg(sumPm25, safeCount),
                minPm25,
                maxPm25,

                // SO2
                avgSo2: safeAvg(sumSo2, safeCount),
                minSo2,
                maxSo2,

                // NO2
                avgNo2: safeAvg(sumNo2, safeCount),
                minNo2,
                maxNo2,

                // CO2
                avgCo2: safeAvg(sumCo2, safeCount),
                minCo2,
                maxCo2,

                // CO
                avgCo: safeAvg(sumCo, safeCount),
                minCo,
                maxCo,

                // O3
                avgO3: safeAvg(sumO3, safeCount),
                minO3,
                maxO3,

                // Noise
                avgNoise: safeAvg(sumNoise, safeCount),
                minNoise,
                maxNoise,

                // PM1
                avgPM1: safeAvg(sumPM1, safeCount),
                minPM1,
                maxPM1,

                // TVOC
                avgTvoc: safeAvg(sumTvoc, safeCount),
                minTvoc,
                maxTvoc,

                // Smoke
                avgSmoke: safeAvg(sumSmoke, safeCount),
                minSmoke,
                maxSmoke,

                // Methane
                avgMethane: safeAvg(sumMethane, safeCount),
                minMethane,
                maxMethane,

                // H2
                avgH2: safeAvg(sumH2, safeCount),
                minH2,
                maxH2,

                // Ammonia
                avgAmmonia: safeAvg(sumAmmonia, safeCount),
                minAmmonia,
                maxAmmonia,

                // H2S
                avgH2s: safeAvg(sumH2s, safeCount),
                minH2s,
                maxH2s,

                // Weather: Temperature
                avgTemperature: safeAvg(sumTemperature, safeCount),
                minTemperature,
                maxTemperature,

                // Weather: Humidity
                avgHumidity: safeAvg(sumHumidity, safeCount),
                minHumidity,
                maxHumidity,
            };
        });
    }
}
