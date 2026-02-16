import { HourlyAggregateRepo } from "../repositories/hourly-aggregate.repo";

export class HourlyAggregationService {
    static async getHourly(deviceId: string, date: string) {
        const records = await HourlyAggregateRepo.findByDate(deviceId, date);

        return records.map((r) => ({
            hourStart: r.hourStart,
            avgAqi: r.sumAqi ? r.sumAqi / r.count : null,
            minAqi: r.minAqi,
            maxAqi: r.maxAqi,
            avgPm25: r.sumPm25 ? r.sumPm25 / r.count : null,
            avgPm10: r.sumPm10 ? r.sumPm10 / r.count : null,
            avgTemp: r.sumTemperature ? r.sumTemperature / r.count : null,
            avgHumidity: r.sumHumidity ? r.sumHumidity / r.count : null,
        }));
    }
}
