import { NextResponse } from "next/server";

import { SearchService } from "../service/search.service";

export class SearchController {
    private searchServiceOBJ = new SearchService();


    /**
     * Handles search requests across city, state, and street fields.
     *
     * Extracts the query parameter `q` from the request, validates input,
     * and delegates the search operation to the service layer.
     *
     * - Returns empty results if the query is too short
     * - Returns 404 if no matching records are found
     * - Returns grouped search results (cities, states, streets) on success
     *
     * @param req   the incoming HTTP request containing the search query
     * @returns     JSON response with search results or error message
     */
    async searchController(req: Request) {
        try {
            const { searchParams } = new URL(req.url);
            const q = searchParams.get("q")?.trim();
            const lat = searchParams.get("lat")?.trim();
            const lng = searchParams.get("lng")?.trim();
            const flag = searchParams.get("flag")?.trim();

            if (!q || q.length < 2) {
                return NextResponse.json({
                    success: true,
                    cities: [],
                    states: [],
                    streets: []
                });
            }

            if (!flag) {
                // For map search I user original Databases Locations
                const results = await this.searchServiceOBJ.SearchSericeForMap(q);

                const isEmpty =
                    results.cities.length === 0 &&
                    results.states.length === 0 &&
                    results.streets.length === 0;

                if (isEmpty) {
                    return NextResponse.json(
                        { success: false, message: "No results found" },
                        { status: 404 }
                    );
                }

                return NextResponse.json({
                    success: true,
                    ...results
                }, { status: 200 });

            }

            // Using Map box for reaching more cities
            const results = await this.searchServiceOBJ.SearchService(q, Number(lat), Number(lng));

            const isEmpty =
                results.streets.length === 0;

            if (isEmpty) {
                return NextResponse.json(
                    { success: false, message: "No results found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                ...results
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }

    /**
     * Handles HTTP request to retrieve AQI and environmental data
     * for a specific street location.
     *
     * Extracts country, state, city, and street from query parameters,
     * validates input, and delegates processing to the service layer.
     *
     * Returns averaged AQI data if found, otherwise returns default values.
     *
     * @param req   the incoming HTTP request containing query parameters
     * @returns     JSON response with AQI data or an error message
     */
    async searchByStreetController(req: Request) {
        try {

            const {
                searchParams
            } = new URL(req.url)

            const country = searchParams.get("country")?.trim()
            const state = searchParams.get("state")?.trim().replace("-", " ");

            const rawCity = searchParams.get("city");
            const city = rawCity
                ?.trim()
                .toLowerCase()
                .replace(/-/g, " ")                 // replace all dashes with space
                .replace(/(\d+)([a-zA-Z]+)/, "$1 $2"); // split number + text

            const rawstreet = searchParams.get("street")?.trim();
            const street = rawstreet


            if (!country || !state || !city || !street) {
                return new NextResponse("Country not found", {
                    status: 404
                })
            }

            const averages = await this.searchServiceOBJ.SearchByStreetService(street, city, state, country);

            return NextResponse.json({
                averages
            }, {
                status: 200
            })

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }


    /**
     * Handles HTTP request to retrieve AQI and environmental data
     * for a specific city location.
     *
     * Extracts country, state, and city from query parameters,
     * validates input, and delegates processing to the service layer.
     *
     * Returns averaged AQI data if found, otherwise returns default values.
     *
     * @param req   the incoming HTTP request containing query parameters
     * @returns     JSON response with AQI data or an error message
     */
    async searchByCityController(req: Request) {
        try {

            const {
                searchParams
            } = new URL(req.url)

            const country = searchParams.get("country")?.trim()
            const state = searchParams.get("state")?.trim().replace("-", " ");
            const rawCity = searchParams.get("city");
            const city = rawCity
                ?.trim()
                .toLowerCase()
                .replace(/-/g, " ")                 // replace all dashes with space
                .replace(/(\d+)([a-zA-Z]+)/, "$1 $2"); // split number + text

            if (!country || !state || !city) {
                return new NextResponse("Country not found", {
                    status: 404
                })
            }

            const averages = await this.searchServiceOBJ.SearchByCityService(city, state, country);

            return NextResponse.json({
                averages
            }, {
                status: 200
            })

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }


    /**
     * Handles HTTP request to retrieve AQI and environmental data
     * for a specific city location.
     *
     * Extracts country and state from query parameters,
     * validates input, and delegates processing to the service layer.
     *
     * Returns averaged AQI data if found, otherwise returns default values.
     *
     * @param req   the incoming HTTP request containing query parameters
     * @returns     JSON response with AQI data or an error message
     */
    async searchByStateController(req: Request) {
        try {

            const {
                searchParams
            } = new URL(req.url)

            const country = searchParams.get("country")?.trim()
            const state = searchParams.get("state")?.trim().replace("-", " ");

            if (!country || !state) {
                return new NextResponse("Country not found", {
                    status: 404
                })
            }

            const averages = await this.searchServiceOBJ.SearchByStateService(state, country);

            return NextResponse.json({
                averages
            }, {
                status: 200
            })

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }


    /**
     * Handles HTTP request to retrieve AQI and environmental data
     * for a specific city location.
     *
     * Extracts country from query parameters,
     * validates input, and delegates processing to the service layer.
     *
     * Returns averaged AQI data if found, otherwise returns default values.
     *
     * @param req   the incoming HTTP request containing query parameters
     * @returns     JSON response with AQI data or an error message
     */
    async searchByCountryController(req: Request) {
        try {

            const {
                searchParams
            } = new URL(req.url)

            const country = searchParams.get("country")?.trim()

            if (!country) {
                return new NextResponse("Country not found", {
                    status: 404
                })
            }

            const averages = await this.searchServiceOBJ.SearchByCountryService(country);

            return NextResponse.json({
                averages
            }, {
                status: 200
            })

        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }
}