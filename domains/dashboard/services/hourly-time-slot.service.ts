import { TIME_SLOTS } from "@/utils/timeSlots";
import { HourlyTimeSlotRepository } from "../repositories/hourly-time-slot.repo";
import { HourlyAggregateReading } from "@prisma/client";

export class HourlyTimeSlotService {
    private repo: HourlyTimeSlotRepository;

    constructor() {
        this.repo = new HourlyTimeSlotRepository();
    }

    async getHeatmap(deviceId: string, startDate: string) {
        const start = new Date(startDate);
        // console.log(start)
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        const records = await this.repo.getHourlyTimeSlotAggregates(deviceId, start, end);


        // group by date
        const grouped: Record<string, HourlyAggregateReading[]> = {};

        for (const record of records) {
            const dayKey = record.hourStart.toISOString().split("T")[0];

            if (!grouped[dayKey]) grouped[dayKey] = [];
            grouped[dayKey].push(record);
        }
        // console.log(grouped)

        const heatmap = [];

        const sortedDays = Object.keys(grouped).sort();

        for (const dayKey of sortedDays) {
            const dayRecords = grouped[dayKey] ?? [];

            const slots = TIME_SLOTS.map((slot) => {
                const slotStart = slot.startHour;
                const slotEnd = slot.startHour + 2;

                const slotRecords = dayRecords.filter((r) => {
                    const hour = new Date(r.hourStart).getHours();
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
