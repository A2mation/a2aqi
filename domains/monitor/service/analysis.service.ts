import { advancedAnalysisKey } from "@/constant/monitor.key";
import { AdvancedAnalysisRepo } from "../repo/analysis.repo";
import { DailyStats, DashboardParams } from "../types/type";
import { redis } from "@/lib/redis";

export class AdvancedAnalysiService {

    private obj = new AdvancedAnalysisRepo();

    private async getBasicDashboardStats(
        deviceId: string,
        params: DashboardParams
    ) {
        let rawData: DailyStats[] = [];

        switch (params.type) {
            case 'week':
                rawData = await this.obj.findLast7Days(deviceId, params.dateStr) as unknown as DailyStats[];
                break;
            case 'month':
                rawData = await this.obj.findLast30Days(deviceId, params.year, params.month) as unknown as DailyStats[];
                break;
            case 'custom':
                rawData = await this.obj.findLast90Days(deviceId, params.dateStr, params.day) as unknown as DailyStats[];
                break;
            default:
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

    private async getTop5Devices(monitorId: string): Promise<{
        id: string;
        serialNo: string;
        modelName: string;
        location: string | null;
    }[]> {
        const devices = await this.obj.getTop5DevicesDetails(monitorId);

        return devices.map((d) => ({
            id: d.device.id,
            serialNo: d.device.serialNo,
            modelName: d.device.model.name,
            location: d.device.loaction
        }));

    }

    async getAllData(monitorId: string, params: DashboardParams): Promise<{
        devices: {
            id: string;
            serialNo: string;
            modelName: string;
            location: string | null;
        }[];
        history: any[];
    }> {

        // Redis Layer
        const cacheKey = advancedAnalysisKey(monitorId);

        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            return { ...parsed, cached: true };
        }

        // Main Logic
        const devices = await this.getTop5Devices(monitorId);

        if (!devices || devices.length === 0) {
            return { devices: [], history: [] };
        }

        // Each element in devices.map starts an asynchronous execution immediately
        const allHistoryRaw = await Promise.all(
            devices.map(async (dev) => {
                try {
                    const stats = await this.getBasicDashboardStats(dev.id, params);
                    return {
                        serialNo: dev.serialNo,
                        stats
                    };
                } catch (error) {
                    console.error(`Failed to fetch stats for ${dev.serialNo}:`, error);
                    // Return empty stats so the rest of the dashboard still works
                    return { serialNo: dev.serialNo, stats: [] };
                }
            })
        );

        const historyMap: Record<string, any> = {};

        allHistoryRaw.forEach((deviceData) => {
            const { serialNo, stats } = deviceData;

            stats.forEach((day: any) => {
                const dateKey = day.date;

                if (!historyMap[dateKey]) {
                    historyMap[dateKey] = { timestamp: dateKey };
                }

                // Map the entire parameter set to the Serial Number
                historyMap[dateKey][serialNo] = { ...day };

                // Clean up the nested date to save payload size
                delete historyMap[dateKey][serialNo].date;
            });
        });

        const result = {
            devices,
            history: Object.values(historyMap).sort((a: any, b: any) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            )
        };

        await redis.setex(cacheKey, 3600, JSON.stringify(result));

        return result;
    }
}