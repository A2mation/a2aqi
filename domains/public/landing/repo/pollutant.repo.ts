import { prisma } from "@/lib/prisma";

export class PollutantsRepository {

    /**
     * Fetch nearby AQI data based on coordinates from WAQI
     * 
     * @param lat - Latitude of the location
     * @param lng - Longitude of the location
     * @param latDelta - Latitude range offset
     * @param lngDelta - Longitude range offset
     * @returns List of nearby AQI readings
     */
    public async getNearbyCandidates(lat: number, lng: number, latDelta: number, lngDelta: number) {
        return prisma.aQIReading.findMany({
            where: {
                lat: { gte: lat - latDelta, lte: lat + latDelta },
                lng: { gte: lng - lngDelta, lte: lng + lngDelta },
            },
            take: 10,
        });
    }


    /**
     * Fetch nearby AQI data based on coordinates from OWN DEVICE
     * 
     * @param lat - Latitude of the location
     * @param lng - Longitude of the location
     * @param latDelta - Latitude range offset
     * @param lngDelta - Longitude range offset
     * @returns List of nearby AQI readings
     */
    public async getNearbyLatestReadings(lat: number, lng: number, latDelta: number, lngDelta: number) {
        return prisma.latestSensorReading.findMany({
            where: {
                device: {
                    lat: { gte: lat - latDelta, lte: lat + latDelta },
                    lng: { gte: lng - lngDelta, lte: lng + lngDelta },
                }
            },
            take: 10,
            select: {
                id: true,
                aqi: true,
                pm10: true,
                pm25: true,
                so2: true,
                no2: true,
                co2: true,
                co: true,
                o3: true,
                noise: true,
                pm1: true,
                tvoc: true,
                smoke: true,
                methane: true,
                h2: true,
                ammonia: true,
                h2s: true,
                temperature: true,
                humidity: true,
                device: {
                    select: {
                        serialNo: true,
                        lat: true,
                        lng: true
                    }
                },
                updatedAt: true
            }
        });
    }
}