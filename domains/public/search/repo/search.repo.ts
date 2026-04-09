import { prisma } from "@/lib/prisma";
import { SearchBy } from "../dto/search.dto";

export class SearchRepo {

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