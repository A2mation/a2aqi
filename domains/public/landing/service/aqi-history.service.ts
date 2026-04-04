import { AQIHistoryRepository } from "../repo/aqi-history.repo";

/**
 * Maintained the same type  of Internal and External Sources
 */
export class AQIHistoryService {
    private aqiHistoy = new AQIHistoryRepository();

    public async getAqiHistoryFromInternalSource(deviceId: string, date: string) {
        const rawHistory = await this.aqiHistoy.findLastWeekDataFromInternalSource(deviceId, date);

        return rawHistory.map((raw) => ({
            id: raw.id,
            aqi: raw.sumAqi / raw.count,
            temperature: raw.sumTemperature ? raw.sumTemperature / raw.count : null,
            createdAt: raw.dayStart
        }))
    }

    public async getAqiHistoryFromExternalSource(lat: number, lng: number) {
        return await this.aqiHistoy.findLastWeekDataFromExternalSource(lat, lng)
    }
}