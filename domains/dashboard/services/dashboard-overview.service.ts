import { SensorReadingRepo } from "../repositories/sensor-reading.repo";
import { DailyAggregateRepo } from "../repositories/daily-aggregate.repo";
import { safeAvg } from "../utils/average.util";
import { getAqiLevel } from "../utils/aqi.util";

export class DashboardOverviewService {
    static async getOverview(deviceId: string, date: string) {
        const latest = await SensorReadingRepo.getLatest(deviceId);

        const daily = await DailyAggregateRepo.findByDay(deviceId, date);

        return {
            latest: latest
                ? {
                    measuredAt: latest.measuredAt,

                    aqi: latest.aqi ?? null,
                    pm25: latest.pm25 ?? null,
                    pm10: latest.pm10 ?? null,
                    pm1: latest.pm1 ?? null,

                    so2: latest.so2 ?? null,
                    no2: latest.no2 ?? null,
                    co2: latest.co2 ?? null,
                    co: latest.co ?? null,
                    o3: latest.o3 ?? null,

                    tvoc: latest.tvoc ?? null,
                    smoke: latest.smoke ?? null,
                    methane: latest.methane ?? null,
                    h2: latest.h2 ?? null,
                    ammonia: latest.ammonia ?? null,
                    h2s: latest.h2s ?? null,

                    noise: latest.noise ?? null,

                    temperature: latest.temperature ?? null,
                    humidity: latest.humidity ?? null,
                }
                : null,

            daily: daily
                ? {
                    dayStart: daily.dayStart,
                    count: daily.count,

                    // AQI
                    avgAqi: safeAvg(daily.sumAqi, daily.count),
                    minAqi: daily.minAqi ?? null,
                    maxAqi: daily.maxAqi ?? null,

                    // PM10
                    avgPm10: safeAvg(daily.sumPm10, daily.count),
                    minPm10: daily.minPm10 ?? null,
                    maxPm10: daily.maxPm10 ?? null,

                    // PM2.5
                    avgPm25: safeAvg(daily.sumPm25, daily.count),
                    minPm25: daily.minPm25 ?? null,
                    maxPm25: daily.maxPm25 ?? null,

                    // SO2
                    avgSo2: safeAvg(daily.sumSo2, daily.count),
                    minSo2: daily.minSo2 ?? null,
                    maxSo2: daily.maxSo2 ?? null,

                    // NO2
                    avgNo2: safeAvg(daily.sumNo2, daily.count),
                    minNo2: daily.minNo2 ?? null,
                    maxNo2: daily.maxNo2 ?? null,

                    // CO2
                    avgCo2: safeAvg(daily.sumCo2, daily.count),
                    minCo2: daily.minCo2 ?? null,
                    maxCo2: daily.maxCo2 ?? null,

                    // CO
                    avgCo: safeAvg(daily.sumCo, daily.count),
                    minCo: daily.minCo ?? null,
                    maxCo: daily.maxCo ?? null,

                    // O3
                    avgO3: safeAvg(daily.sumO3, daily.count),
                    minO3: daily.minO3 ?? null,
                    maxO3: daily.maxO3 ?? null,

                    // Noise
                    avgNoise: safeAvg(daily.sumNoise, daily.count),
                    minNoise: daily.minNoise ?? null,
                    maxNoise: daily.maxNoise ?? null,

                    // PM1
                    avgPM1: safeAvg(daily.sumPM1, daily.count),
                    minPM1: daily.minPM1 ?? null,
                    maxPM1: daily.maxPM1 ?? null,

                    // TVOC
                    avgTvoc: safeAvg(daily.sumTvoc, daily.count),
                    minTvoc: daily.minTvoc ?? null,
                    maxTvoc: daily.maxTvoc ?? null,

                    // Smoke
                    avgSmoke: safeAvg(daily.sumSmoke, daily.count),
                    minSmoke: daily.minSmoke ?? null,
                    maxSmoke: daily.maxSmoke ?? null,

                    // Methane
                    avgMethane: safeAvg(daily.sumMethane, daily.count),
                    minMethane: daily.minMethane ?? null,
                    maxMethane: daily.maxMethane ?? null,

                    // H2
                    avgH2: safeAvg(daily.sumH2, daily.count),
                    minH2: daily.minH2 ?? null,
                    maxH2: daily.maxH2 ?? null,

                    // Ammonia
                    avgAmmonia: safeAvg(daily.sumAmmonia, daily.count),
                    minAmmonia: daily.minAmmonia ?? null,
                    maxAmmonia: daily.maxAmmonia ?? null,

                    // H2S
                    avgH2s: safeAvg(daily.sumH2s, daily.count),
                    minH2s: daily.minH2s ?? null,
                    maxH2s: daily.maxH2s ?? null,

                    // Weather - Temperature
                    avgTemperature: safeAvg(daily.sumTemperature, daily.count),
                    minTemperature: daily.minTemperature ?? null,
                    maxTemperature: daily.maxTemperature ?? null,

                    // Weather - Humidity
                    avgHumidity: safeAvg(daily.sumHumidity, daily.count),
                    minHumidity: daily.minHumidity ?? null,
                    maxHumidity: daily.maxHumidity ?? null,

                    // AQI Level
                    aqiLevel: getAqiLevel(safeAvg(daily.sumAqi, daily.count)),
                }
                : null,
        };
    }
}
