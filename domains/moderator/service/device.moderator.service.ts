import { DailyStats, DashboardParams, HeatmapDay, HeatmapRow } from "@/domains/monitor/types/type";
import { ModeratorDeviceRepo } from "../repo/device.moderator.repo";
import { HOURLY_SLOTS } from "@/utils/timeSlots";

export class ModeratorDeviceService {
    private obj = new ModeratorDeviceRepo();

    async getHeatmap(deviceId: string, startDate: string) {
        const rows = (await this.obj.getForADeviceHeatmapAgg(
            deviceId,
            startDate
        )) as unknown as HeatmapRow[];

        const defaultSensorValues = {
            aqi: 0, pm10: 0, pm25: 0, so2: 0, no2: 0, co2: 0, co: 0, o3: 0,
            noise: 0, pm1: 0, tvoc: 0, smoke: 0, methane: 0, h2: 0,
            ammonia: 0, h2s: 0, temperature: 0, humidity: 0
        };

        const grouped: Record<string, any> = {};

        for (const row of rows) {
            if (!grouped[row.date]) {
                grouped[row.date] = {};
            }
            grouped[row.date][row.hour] = row;
        }

        const heatmap: HeatmapDay[] = [];

        for (const date of Object.keys(grouped).sort()) {
            const slots = HOURLY_SLOTS.map((slot) => {
                const data = grouped[date][slot.startHour];

                if (!data) return { time: slot.label, data: null };

                const cleanedData = Object.fromEntries(
                    Object.entries(data)
                        .filter(([_, value]) => value !== null && value !== undefined)
                        .map(([key, value]) => {
                            const roundedValue = typeof value === 'number'
                                ? Math.round(value)
                                : value;

                            return [key, roundedValue];
                        })
                );

                return {
                    time: slot.label,
                    ...cleanedData,
                };
            })


            heatmap.push({ date, slots });

        }

        return {
            startDate,
            endDate: Object.keys(grouped).slice(-1)[0] ?? startDate,
            heatmap,
        };
    }

    async getSingleDeviceDetails(deviceId: string) {
        if (!deviceId) {
            throw new Error("Device ID is required")
        }

        const devices = await this.obj.getDeviceById(deviceId)

        return devices
    }

    async getDailyBasicDashboardStats(
        deviceId: string,
        params: DashboardParams
    ) {
        let rawData: DailyStats[] = [];

        switch (params.type) {
            case 'day':
                rawData = await this.obj.findByDay(deviceId, params.dayStart) as unknown as DailyStats[];
                break;
            case 'week':
                rawData = await this.obj.findByWeek(deviceId, params.dateStr) as unknown as DailyStats[];
                break;
            case 'month':
                rawData = await this.obj.findByMonth(deviceId, params.year, params.month) as unknown as DailyStats[];
                break;
            case 'custom':
                rawData = await this.obj.findLastCustomeDays(deviceId, params.dateStr, params.day) as unknown as DailyStats[];
                break;
            default:
                const _exhaustiveCheck: never = params;
                return [];
        }


        const formattedData = rawData.map((item: DailyStats) => {
            const cleanItems = {
                date: item.date,
                aqi: Math.round(item.aqi),
                pm10: Math.round(item.pm10) || null,
                pm25: Math.round(item.pm25) || null,
                so2: Math.round(item.so2) || null,
                no2: Math.round(item.no2) || null,
                co2: Math.round(item.co2) || null,
                co: Math.round(item.co) || null,
                o3: Math.round(item.o3) || null,
                noise: Math.round(item.noise) || null,
                pm1: Math.round(item.pm1) || null,
                tvoc: Math.round(item.tvoc) || null,
                smoke: Math.round(item.smoke) || null,
                methane: Math.round(item.methane) || null,
                h2: Math.round(item.h2) || null,
                ammonia: Math.round(item.ammonia) || null,
                h2s: Math.round(item.h2s) || null,
                temperature: Math.round(item.temperature) || null,
                humidity: Math.round(item.humidity) || null,
            }

            return Object.fromEntries(
                Object.entries(cleanItems).filter(([_, value]) => value !== null)
            );
        });

        return formattedData;
    }

    async getLatestSensorData(deviceId: string) {
        if (!deviceId) {
            throw new Error("Device ID is required")
        }

        const sensorData = await this.obj.getLatestSensorReadings(deviceId)

        if (!sensorData) {
            throw new Error("No sensor data found for this device")
        }

        return sensorData
    }
}