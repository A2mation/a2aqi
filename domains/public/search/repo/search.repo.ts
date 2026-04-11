import { prisma } from "@/lib/prisma";
import { SearchBy } from "../dto/search.dto";

export class SearchRepo {

    /**
     * Searches for nearby cities within a geographic bounding box defined by
     * a central latitude/longitude and delta values.
     *
     * @param latNum - The latitude of the center point (in decimal degrees).
     * @param lonNum - The longitude of the center point (in decimal degrees).
     * @param latDelta - The latitude span (distance north/south) from the center point.
     *                   This defines how far to search vertically.
     * @param lngDelta - The longitude span (distance east/west) from the center point.
     *                   This defines how far to search horizontally.
     *
     * @returns A promise that resolves with a list of nearby cities (format depends on implementation).
     *
     * @example
     * // Search for cities around a location with a 0.5° radius
     * await SearchNearbyCitiesByLatLng(22.5726, 88.3639, 0.5, 0.5);
     *
     * @remarks
     * - The search area is typically a rectangular bounding box:
     *   latitude range:  latNum ± latDelta
     *   longitude range: lonNum ± lngDelta
     * - Ensure delta values are appropriate for the desired search radius.
     * - Larger delta values will return more results but may impact performance.
     */
    async SearchNearbyCitiesByLatLng(latNum: number, lonNum: number, latDelta: number, lngDelta: number) {
        return await prisma.aQIReading.findMany({
            where: {
                lat: { gte: latNum - latDelta, lte: latNum + latDelta },
                lng: { gte: lonNum - lngDelta, lte: lonNum + lngDelta },
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
            orderBy: { createdAt: "asc" },
            take: 5,
        });
    }

    /**
     * Searches AQI readings using a query and field filter within today's date range.
     *
     * @param q              search keyword
     * @param searchBy       field to search (city/state/country)
     * @param startOfToday   start of today's range
     * @param endOfToday     end of today's range
     * @returns              list of matching AQI records (limited to 10)
     */
    async SearchByUserQuery(q: string, searchBy: SearchBy, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.findMany({
            where: {
                [searchBy]: {
                    startsWith: q,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday
                }
            },
            select: {
                id: true,
                city: true,
                state: true,
                country: true,
                street: true,
                aqi: true,
                createdAt: true,
                lat: true,
                lng: true
            },
            take: 10,
        })
    }


    /**
     * Retrieves data filtered by state and country within the current day's time range.
     *
     * @param street        the street name used as a search criterion  
     * @param city          the city name used as a search criterion     
     * @param state         the state name used as a search criterion
     * @param country       the country name used as a search criterion
     * @param startOfToday  the start of today's time range
     * @param endOfToday    the end of today's time range
     */
    async SearchByStreet(street: string, city: string, state: string, country: string, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.aggregate({
            where: {
                street: {
                    equals: street,
                    mode: 'insensitive'
                },
                city: {
                    equals: city,
                    mode: "insensitive"
                },
                state: {
                    equals: state,
                    mode: "insensitive"
                },
                country: {
                    equals: country,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
            },
            _avg: {
                aqi: true,
                pm10: true,
                pm25: true,
                temperature: true,
                humidity: true,
            },
            _count: {
                _all: true,
            },
        })
    }

    /**
     * Retrieves data filtered by state and country within the current day's time range.
     *
     * @param city          the city name used as a search criterion     
     * @param state         the state name used as a search criterion
     * @param country       the country name used as a search criterion
     * @param startOfToday  the start of today's time range
     * @param endOfToday    the end of today's time range
     */
    async SearchByCity(city: string, state: string, country: string, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.aggregate({
            where: {
                city: {
                    equals: city,
                    mode: "insensitive"
                },
                state: {
                    equals: state,
                    mode: "insensitive"
                },
                country: {
                    equals: country,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
            },
            _avg: {
                aqi: true,
                pm10: true,
                pm25: true,
                temperature: true,
                humidity: true,
            },
            _count: {
                _all: true,
            },
        })
    }

    /**
     * Retrieves data filtered by state and country within the current day's time range.
     *
     * @param state         the state name used as a search criterion
     * @param country       the country name used as a search criterion
     * @param startOfToday  the start of today's time range
     * @param endOfToday    the end of today's time range
     */
    async SearchByState(state: string, country: string, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.aggregate({
            where: {
                state: {
                    equals: state,
                    mode: "insensitive"
                },
                country: {
                    equals: country,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
            },
            _avg: {
                aqi: true,
                pm10: true,
                pm25: true,
                temperature: true,
                humidity: true,
            },
            _count: {
                _all: true,
            },
        })
    }

    /**
     * Retrieves data based on the specified country and filters results
     * within the time range of the current day.
     *
     * @param country       the country name used as a search criterion
     * @param startOfToday  the beginning of today's time range
     * @param endOfToday    the end of today's time range
     */
    async SearchByCountry(country: string, startOfToday: Date, endOfToday: Date) {
        return await prisma.aQIReading.aggregate({
            where: {
                country: {
                    equals: country,
                    mode: "insensitive"
                },
                createdAt: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
            },
            _avg: {
                aqi: true,
                pm10: true,
                pm25: true,
                temperature: true,
                humidity: true,
            },
            _count: {
                _all: true,
            },
        })
    }
}