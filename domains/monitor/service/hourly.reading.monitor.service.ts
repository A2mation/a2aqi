
import { HOURLY_SLOTS } from "@/utils/timeSlots";
import { getHeatmapAgg } from "../repo/hourly.reading.repo";
import { HeatmapDay, HeatmapRow } from "../types/type";

export async function getHeatmap(deviceId: string, startDate: string) {
   const rows = (await getHeatmapAgg(
        deviceId,
        startDate
    )) as unknown as HeatmapRow[];

    // console.log(rows)

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

            return {
                time: slot.label,
                ...data,
            };
        });

        heatmap.push({ date, slots });
    }

    return {
        startDate,
        endDate: Object.keys(grouped).slice(-1)[0] ?? startDate,
        heatmap,
    };
}