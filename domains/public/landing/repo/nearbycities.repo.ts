import { prisma } from "@/lib/prisma";

export class NearByCitiesRepository {

     /**
     * Fetch nearby AQI data based on coordinates from WAQI
     * 
     * @param lat - Latitude of the location
     * @param lng - Longitude of the location
     * @param latDelta - Latitude range offset
     * @param lngDelta - Longitude range offset
     * @returns List of nearby AQI readings (20 Readings)
     */
    public async nearbyCitiesData(lat: number, lng: number, latDelta: number, lngDelta: number) {
        return await prisma.aQIReading.findMany({
            where: {
                lat: { gte: lat - latDelta, lte: lat + latDelta },
                lng: { gte: lng - lngDelta, lte: lng + lngDelta },
            },
            select: {
                id: true,
                location: true,
                aqi: true,
                pm25: true,
                pm10: true,
                temperature: true,
                humidity: true,
                lat: true,
                lng: true,
                source: true
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
    }
}