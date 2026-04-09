import { adjustTemperature, getTodayWindow } from "@/helpers/time";
import { SearchRepo } from "../repo/search.repo";
import { SearchResult } from "../dto/search.dto";

export class SearchService {
    private searchRepoOBJ = new SearchRepo();


    /**
     * Performs a unified search across city, state, and street fields
     * using the provided query within today's date range.
     *
     * Results are grouped and deduplicated by their respective fields:
     * - Cities (unique by city name)
     * - States (unique by state name)
     * - Streets (unique by street name)
     *
     * Each group returns a list of formatted search results including
     * location details, AQI, and coordinates.
     *
     * @param q        the search query string
     * @returns        an object containing categorized search results:
     *                 { streets, cities, states }
     */
    async SearchService(q: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const cityResults = await this.searchRepoOBJ.SearchByUserQuery(q, 'city', startOfToday, endOfToday);

        const cityMap = new Map()
        for (const r of cityResults) {
            if (!cityMap.has(r.city)) {
                cityMap.set(r.city, {
                    id: r.id,
                    name: r.city,
                    state: r.state,
                    country: r.country,
                    street: r.street,
                    aqi: r.aqi,
                    lat: r.lat,
                    lng: r.lng
                })
            }
        }


        const stateResults = await this.searchRepoOBJ.SearchByUserQuery(q, 'state', startOfToday, endOfToday);

        const stateMap = new Map()
        for (const r of stateResults) {
            if (!stateMap.has(r.state)) {
                stateMap.set(r.state, {
                    id: r.id,
                    name: r.state,
                    state: r.state,
                    city: r.city,
                    street: r.street,
                    country: r.country,
                    aqi: r.aqi,
                    lat: r.lat,
                    lng: r.lng
                })
            }
        }


        const streetsResults = await this.searchRepoOBJ.SearchByUserQuery(q, 'street', startOfToday, endOfToday)

        const streetMap = new Map()
        for (const r of streetsResults) {
            if (!streetMap.has(r.street)) {
                streetMap.set(r.street, {
                    id: r.id,
                    name: r.country,
                    country: r.country,
                    state: r.state,
                    city: r.city,
                    street: r.street,
                    aqi: r.aqi,
                    lat: r.lat,
                    lng: r.lng
                })
            }
        }


        const finalCities = Array.from(cityMap.values()) as SearchResult[];
        const finalStates = Array.from(stateMap.values()) as SearchResult[];
        const finalStreets = Array.from(streetMap.values()) as SearchResult[];


        return {
            streets: finalStreets,
            cities: finalCities,
            states: finalStates
        }
    }


    /**
     * Retrieves AQI and environmental data for a specific street location
     * (street, city, state, country) within the current day's time range.
     *
     * If no records are found, default values are returned.
     * Otherwise, aggregated averages are computed and temperature is adjusted
     * before returning the response.
     *
     * @param street   the street name to search
     * @param city     the city name
     * @param state    the state name
     * @param country  the country name
     * @returns        an object containing AQI, PM10, PM2.5, temperature, humidity, and location details
     */
    async SearchByStreetService(street: string, city: string, state: string, country: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const streets = await this.searchRepoOBJ.SearchByStreet(street, city, state, country, startOfToday, endOfToday);

        if (streets._count._all === 0) {
            return {
                aqi: 150,
                pm10: 148,
                pm25: 152,
                temperature: 26,
                humidity: 80,
                street: street,
                city: city,
                state: state,
                country: country
            };
        }

        const avgTemp = streets._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)

        return {
            aqi: streets._avg.aqi,
            pm10: streets._avg.pm10,
            pm25: streets._avg.pm25,
            temperature: adjustedTemperature,
            humidity: streets._avg.humidity?.toFixed(2),
            street: street,
            city: city,
            state: state,
            country: country
        }
    }


    /**
     * Retrieves AQI and environmental data for a specific street location
     * (city, state, country) within the current day's time range.
     *
     * If no records are found, default values are returned.
     * Otherwise, aggregated averages are computed and temperature is adjusted
     * before returning the response.
     *
     * @param city     the city name
     * @param state    the state name
     * @param country  the country name
     * @returns        an object containing AQI, PM10, PM2.5, temperature, humidity, and location details
     */
    async SearchByCityService(city: string, state: string, country: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const streets = await this.searchRepoOBJ.SearchByCity(city, state, country, startOfToday, endOfToday);

        if (streets._count._all === 0) {
            return {
                aqi: 150,
                pm10: 148,
                pm25: 152,
                temperature: 26,
                humidity: 80,
                city: city,
                state: state,
                country: country
            };
        }

        const avgTemp = streets._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)

        return {
            aqi: streets._avg.aqi,
            pm10: streets._avg.pm10,
            pm25: streets._avg.pm25,
            temperature: adjustedTemperature,
            humidity: streets._avg.humidity?.toFixed(2),
            city: city,
            state: state,
            country: country
        }
    }


    /**
     * Retrieves AQI and environmental data for a specific street location
     * (state, country) within the current day's time range.
     *
     * If no records are found, default values are returned.
     * Otherwise, aggregated averages are computed and temperature is adjusted
     * before returning the response.
     *
     * @param state    the state name
     * @param country  the country name
     * @returns        an object containing AQI, PM10, PM2.5, temperature, humidity, and location details
     */
    async SearchByStateService(state: string, country: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const streets = await this.searchRepoOBJ.SearchByState(state, country, startOfToday, endOfToday);

        if (streets._count._all === 0) {
            return {
                aqi: 150,
                pm10: 148,
                pm25: 152,
                temperature: 26,
                humidity: 80,
                state: state,
                country: country
            };
        }

        const avgTemp = streets._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)

        return {
            aqi: streets._avg.aqi,
            pm10: streets._avg.pm10,
            pm25: streets._avg.pm25,
            temperature: adjustedTemperature,
            humidity: streets._avg.humidity?.toFixed(2),
            state: state,
            country: country
        }
    }


    /**
     * Retrieves AQI and environmental data for a specific street location
     * (country) within the current day's time range.
     *
     * If no records are found, default values are returned.
     * Otherwise, aggregated averages are computed and temperature is adjusted
     * before returning the response.
     *
     * @param country  the country name
     * @returns        an object containing AQI, PM10, PM2.5, temperature, humidity, and location details
     */
    async SearchByCountryService(country: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const streets = await this.searchRepoOBJ.SearchByCountry(country, startOfToday, endOfToday);

        if (streets._count._all === 0) {
            return {
                aqi: 150,
                pm10: 148,
                pm25: 152,
                temperature: 26,
                humidity: 80,
                country: country
            };
        }

        const avgTemp = streets._avg.temperature

        const adjustedTemperature = adjustTemperature(avgTemp)

        return {
            aqi: streets._avg.aqi,
            pm10: streets._avg.pm10,
            pm25: streets._avg.pm25,
            temperature: adjustedTemperature,
            humidity: streets._avg.humidity?.toFixed(2),
            country: country
        }
    }
}