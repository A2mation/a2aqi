import { discardNullFields } from "@/domains/dashboard/utils/average.util";
import { findByDay, findByMonth, findByWeek, findLastCustomeDays } from "../repo/dailycustom.reading.repo";
import { DailyStats, DashboardParams } from "../types/type";

export async function getDailyBasicDashboardStats(
    deviceId: string,
    params: DashboardParams
) {
    let rawData: DailyStats[] = [];

    switch (params.type) {
        case 'day':
            rawData = await findByDay(deviceId, params.dayStart) as unknown as DailyStats[];
            break;
        case 'week':
            rawData = await findByWeek(deviceId, params.dateStr) as unknown as DailyStats[];
            break;
        case 'month':
            rawData = await findByMonth(deviceId, params.year, params.month) as unknown as DailyStats[];
            break;
        case 'custom':
            rawData = await findLastCustomeDays(deviceId, params.dateStr, params.day) as unknown as DailyStats[];
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