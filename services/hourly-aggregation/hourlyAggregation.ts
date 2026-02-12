import { prisma } from "@/lib/prisma";
import { getPreviousHourWindow } from "@/helpers/time";

export async function runHourlyAggregation() {
    // const { hourStart, hourEnd } = getPreviousHourWindow();

    // // Fetch distinct city+source combinations
    // const readings = await prisma.aQIReading.findMany({
    //     where: {
    //         measuredAt: {
    //             gte: hourStart,
    //             lt: hourEnd,
    //         },
    //     },
    //     select: {
    //         city: true,
    //         state: true,
    //         country: true,
    //         lat: true,
    //         lng: true,
    //         source: true,
    //         aqi: true,
    //         pm25: true,
    //         pm10: true,
    //         temperature: true,
    //         humidity: true,
    //     },
    // });

    // if (readings.length === 0) return { processed: 0 };

    // const groups = new Map<string, typeof readings>();

    // for (const r of readings) {
    //     const key = `${r.lat}-${r.lng}-${r.source}`;
    //     if (!groups.has(key)) groups.set(key, []);
    //     groups.get(key)!.push(r);
    // }
    

    // for (const [_, group] of groups) {
    //     const count = group.length;
       

    //     const avg = (key: keyof typeof group[0]) =>
    //         group
    //             .map(r => r[key])
    //             .filter(v => typeof v === "number") as number[];

    //     const avgValue = (values: number[]) =>
    //         values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

    //     const aqis = avg("aqi");
    //     console.log(group[0])

    //     const res = await prisma.hourlyAggregateReading.create({
    //         data: {
    //             lat: group[0].lat,
    //             lng: group[0].lng,
    //             city: group[0].city,
    //             state: group[0].state,
    //             country: group[0].country,
    //             source: group[0].source,

    //             hourStart,
    //             hourEnd,

    //             avgAqi: avgValue(aqis)!,
    //             maxAqi: Math.max(...aqis),
    //             minAqi: Math.min(...aqis),

    //             avgPm25: avgValue(avg("pm25")),
    //             avgPm10: avgValue(avg("pm10")),
    //             avgTemperature: avgValue(avg("temperature")),
    //             avgHumidity: avgValue(avg("humidity")),
    //         },
    //     });
        
    // }

    // return { processed: groups.size };
    // return groups
}
