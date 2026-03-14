import { TIME_SLOTS } from "@/utils/timeSlots";
import { HourlyTimeSlotRepository } from "../repositories/hourly-time-slot.repo";
import { HourlyAggregateReading } from "@prisma/client";

export class HourlyTimeSlotService {
    private repo: HourlyTimeSlotRepository;

    constructor() {
        this.repo = new HourlyTimeSlotRepository();
    }

    async getHeatmap(deviceId: string, startDate: string) {
        // the query window in UTC to cover potential IST overlaps
        const start = new Date(`${startDate}T00:00:00+05:30`);
        const end = new Date(start);
        end.setDate(end.getDate() + 7); 

        const records = await this.repo.getHourlyTimeSlotAggregates(deviceId, start, end);
        // console.log(records)
        
        const grouped: Record<string, HourlyAggregateReading[]> = {};

        for (const record of records) {
            // SHIFT TO IST: Add 5.5 hours to the UTC timestamp
            const istDate = new Date(record.hourStart.getTime() + (5.5 * 60 * 60 * 1000));
            const dayKey = istDate.toISOString().split("T")[0];
            // console.log(dayKey)

            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(record);
        }

        const heatmap = [];
        const sortedDays = Object.keys(grouped).sort();

        for (const dayKey of sortedDays) {
            const dayRecords = grouped[dayKey] ?? [];

            const slots = TIME_SLOTS.map((slot) => {
                const slotStart = slot.startHour;
                const slotEnd = slot.startHour + 2;

                const slotRecords = dayRecords.filter((r) => {
                    // SHIFT TO IST: Add 5.5 hours before checking the hour
                    const istDate = new Date(r.hourStart.getTime() + (5.5 * 60 * 60 * 1000));
                    console.log(istDate)
                    const hour = istDate.getUTCHours(); // Use getUTCHours on shifted date
                    return hour >= slotStart && hour < slotEnd;
                });

                if (slotRecords.length === 0) {
                    return { time: slot.label, aqi: null };
                }

                let totalSumAqi = 0;
                let totalCount = 0;

                for (const r of slotRecords) {
                    if (r.sumAqi !== null) {
                        totalSumAqi += r.sumAqi;
                        totalCount += r.count;
                    }
                }

                return {
                    time: slot.label,
                    aqi: totalCount > 0 ? totalSumAqi / totalCount : null,
                };
            });

            heatmap.push({
                date: dayKey,
                slots,
            });
        }

        return {
            startDate: sortedDays[0] ?? startDate,
            endDate: sortedDays[sortedDays.length - 1] ?? startDate,
            heatmap,
        };
    }
}
