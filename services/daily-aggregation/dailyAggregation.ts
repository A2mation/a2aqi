import { prisma } from "@/lib/prisma";
import { getPreviousDayWindow } from "@/helpers/time";

export async function runDailyAggregation() {
    // const { dayStart, dayEnd } = getPreviousDayWindow();
    // console.log(dayStart,dayEnd)

    // const hourly = await prisma.hourlyAggregateReading.findMany({
    //     where: {
    //         hourStart: {
    //             gte: dayStart,
    //             lt: dayEnd,
    //         },
    //     },
    //     select: {
    //         lat: true,
    //         lng: true,
    //         city: true,
    //         state: true,
    //         country: true,
    //         source: true,

    //         avgAqi: true,
    //         maxAqi: true,
    //         minAqi: true,
    //         avgPm25: true,
    //         avgPm10: true,
    //         avgTemperature: true,
    //         avgHumidity: true,
    //     },
    // });

    // if (hourly.length === 0) return { processed: 0 };

    // // Group by location + source
    // const groups = new Map<string, typeof hourly>();

    // for (const h of hourly) {
    //     const key = `${h.lat}-${h.lng}-${h.source}`;
    //     if (!groups.has(key)) groups.set(key, []);
    //     groups.get(key)!.push(h);
    // }

    // for (const group of groups.values()) {
    //     const avg = (key: keyof typeof group[0]) =>
    //         group
    //             .map(r => r[key])
    //             .filter(v => typeof v === "number") as number[];

    //     const avgValue = (values: number[]) =>
    //         values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

    //     const aqis = avg("avgAqi");

    //     const res = await prisma.dailyAggregateReading.create({
    //         data: {
    //             lat: group[0].lat,
    //             lng: group[0].lng,
    //             city: group[0].city,
    //             state: group[0].state,
    //             country: group[0].country,
    //             source: group[0].source,

    //             date: dayStart,

    //             avgAqi: avgValue(aqis)!,
    //             maxAqi: Math.max(...avg("maxAqi")),
    //             minAqi: Math.min(...avg("minAqi")),

    //             avgPm25: avgValue(avg("avgPm25")),
    //             avgPm10: avgValue(avg("avgPm10")),
    //             avgTemperature: avgValue(avg("avgTemperature")),
    //             avgHumidity: avgValue(avg("avgHumidity")),
    //         },
    //     });
    // }

    // return { processed: groups.size };
}
