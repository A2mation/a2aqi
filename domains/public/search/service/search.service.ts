import { adjustTemperature, getTodayWindow } from "@/helpers/time";
import { SearchRepo } from "../repo/search.repo";
import { SearchResult } from "../dto/search.dto";
import { LocationService } from "./search-based-location.service";
import { haversine } from "@/helpers/haversine";
import { LocationSchema } from "@/services/location-mapbox/fetch-location-from-mapbox";

export class SearchService {
    private searchRepoOBJ = new SearchRepo();
    private locationServiceOBJ = new LocationService();


    /**
     * `Advance Search`
     * 
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
     * @param lat      the user latitude
     * @param lng      the user longitude
     * @returns        an object containing categorized search results:
     *                 { streets, cities, states }
     */
    async SearchService(
        q: string,
        lat: number,
        lng: number
    ) {
        const streetMap = new Map()


        const externalStreets = await this.locationServiceOBJ.searchLocations(q);

        const streetPromises = externalStreets.map(async (loc: LocationSchema) => {
            if (streetMap.has(loc.name)) return;

            let fallbackAqi = 50;
            const [eLng, eLat] = loc.coordinates.coordinates;

            try {
                // We fetch nearby data for each street returned by external API
                const cityAqiData = await this.getNearbyLocationDatabyLatLng(eLat, eLng);
                if (cityAqiData && cityAqiData.length > 0) {
                    fallbackAqi = cityAqiData[0].aqi;
                }
            } catch (e: any) {
                console.warn(`AQI Fallback failed for ${loc.name}:`, e.message);
            }

            // Add to map inside the promise
            streetMap.set(loc.name, {
                id: loc.slug || loc.name,
                name: loc.name,
                country: loc.country,
                state: loc.state,
                city: loc.city,
                // Clean up street name (first two parts of address)
                street: loc.name.split(',').slice(0, 2).join(','),
                aqi: Math.round(fallbackAqi),
                lat: eLat,
                lng: eLng
            });
        });

        await Promise.all(streetPromises);


        const finalStreets = Array.from(streetMap.values()) as SearchResult[];

        // sort by distance
        finalStreets.sort((a, b) => {
            const distanceA = haversine(lat, lng, a.lat, a.lng);
            const distanceB = haversine(lat, lng, b.lat, b.lng);
            return distanceA - distanceB;
        });

        return {
            streets: finalStreets,
        }
    }




    /**
     * `Basic Search`
     * 
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
    async SearchSericeForMap(q: string) {
        const { startOfToday, endOfToday } = getTodayWindow();

        const [cityResults, stateResults, streetResults] = await Promise.all([
            this.searchRepoOBJ.SearchByUserQuery(q, 'city', startOfToday, endOfToday),
            this.searchRepoOBJ.SearchByUserQuery(q, 'state', startOfToday, endOfToday),
            this.searchRepoOBJ.SearchByUserQuery(q, 'street', startOfToday, endOfToday)
        ]);

        const getUniqueResults = (results: any[], key: string) => {
            const map = new Map();
            for (const r of results) {
                if (!map.has(r[key])) {
                    map.set(r[key], {
                        id: r.id,
                        name: r[key],
                        state: r.state,
                        city: r.city,
                        street: r.street,
                        country: r.country,
                        aqi: r.aqi,
                        lat: r.lat,
                        lng: r.lng
                    });
                }
            }
            return Array.from(map.values()) as SearchResult[];
        };

        return {
            cities: getUniqueResults(cityResults, 'city'),
            states: getUniqueResults(stateResults, 'state'),
            streets: getUniqueResults(streetResults, 'street')
        };
    }


    /**
     * Retrieves location-related data for areas near the given geographic coordinates.
     *
     * @param lat - The latitude of the target location (in decimal degrees).
     * @param lng - The longitude of the target location (in decimal degrees).
     *
     * @returns A promise that resolves with `nearest` location data, such as cities,
     *          places, or regions depending on the implementation.
     *
     * @example
     * // Get nearby location data for a specific coordinate
     * await getNearbyLocationDatabyLatLng(22.5726, 88.3639);
     *
     * @remarks
     * - This method typically uses the provided latitude and longitude to perform
     *   a proximity-based search.
     * - The search radius or criteria may be predefined within the implementation.
     * - Ensure valid coordinate ranges:
     *   latitude:  -90 to 90
     *   longitude: -180 to 180
     */
    async getNearbyLocationDatabyLatLng(lat: number, lng: number) {
        const latNum = Math.round(Number(lat) * 100) / 100
        const lonNum = Math.round(Number(lng) * 100) / 100

        const radiusKm = 100;
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos((latNum * Math.PI) / 180));

        const candidates = await this.searchRepoOBJ.SearchNearbyCitiesByLatLng(latNum, lonNum, latDelta, lngDelta);

        const nearest = candidates
            .map((c) => ({
                ...c,
                distanceKm: haversine(latNum, lonNum, c.lat, c.lng),
            }))
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .filter((item, index, self) => {
                return (
                    index ===
                    self.findIndex(
                        (x) => x.lat === item.lat && x.lng === item.lng
                    )
                )
            })
            .slice(0, 1);

        return nearest ? nearest : [];
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

            const loc = await this.locationServiceOBJ.getLocationDetails(street);
            if (!loc.coordinates) {
                return
            }
            const [eLng, eLat] = loc.coordinates.coordinates;

            const candidates = await this.getNearbyLocationDatabyLatLng(eLat, eLng);

            return {
                aqi: candidates[0].aqi,
                pm10: candidates[0].pm10,
                pm25: candidates[0].pm25,
                temperature: candidates[0].temperature,
                humidity: candidates[0].humidity,
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
     * Retrieves AQI and environmental data for a specific City location
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
            
            const loc = await this.locationServiceOBJ.getLocationDetailsbyCity(city);
        
            if (!loc.coordinates) {
                return
            }
            const [eLng, eLat] = loc.coordinates.coordinates;

            const candidates = await this.getNearbyLocationDatabyLatLng(eLat, eLng);

            return {
                aqi: candidates[0].aqi,
                pm10: candidates[0].pm10,
                pm25: candidates[0].pm25,
                temperature: candidates[0].temperature,
                humidity: candidates[0].humidity,
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