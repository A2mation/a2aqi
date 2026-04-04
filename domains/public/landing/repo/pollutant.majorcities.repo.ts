import { prisma } from "@/lib/prisma";

export class PollutantMajorCitiesRepository {

    /**
    * Fetch nearby AQI data based on cities name from WAQI
    * 
    * @param cities - Latitude of the location
    * @returns List of major cities AQI readings
    */
    public async majorCitiesPollutantData(cities: string[]) {
        return await prisma.aQIReading.findMany({
            where: {
                location: { in: cities },
            },
            orderBy: [
                { location: "asc" },
                { measuredAt: "desc" },
            ],
            distinct: ["location"],
            select: {
                location: true,
                aqi: true,
                temperature: true,
                humidity: true,
                measuredAt: true,
            },
        });
    }
}