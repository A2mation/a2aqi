
import { HOURLY_SLOTS } from "@/utils/timeSlots";
import { getHeatmapAgg } from "../repo/hourly.reading.repo";
import { HeatmapDay, HeatmapRow } from "../types/type";

export async function getHeatmap(deviceId: string, startDate: string) {
    const rows = (await getHeatmapAgg(
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