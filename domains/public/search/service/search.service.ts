import { getTodayWindow } from "@/helpers/time";
import { SearchRepo } from "../repo/search.repo";
import { SearchResult } from "../dto/search.dto";

export class SearchService {
    private searchRepoOBJ = new SearchRepo();

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

}