import { http } from "@/lib/http";

export type LocationSchema = {
    name: string;
    slug: string;
    coordinates: {
        type: "Point";
        coordinates: [number, number];
    };
    city?: string;
    state?: string;
    country: string;
};


/**
 * Fetches location suggestions from Mapbox Geocoding API based on a search query.
 *
 * This function performs forward geocoding (text → location data) and returns
 * a list of matching places with structured information suitable for storing
 * in your database or using in autocomplete UI.
 *
 * ⚠️ By default, this uses Mapbox TEMPORARY geocoding unless `permanent=true`
 * is explicitly added in the request parameters.
 *
 * @param query - The user input string (e.g., "barra", "kolkata")
 *
 * @returns Promise resolving to an array of location objects:
 * - name: Full formatted address (e.g., "Barrackpore, West Bengal, India")
 * - slug: URL-friendly identifier (e.g., "barrackpore")
 * - coordinates: GeoJSON Point ([longitude, latitude])
 * - city: Extracted city/place name (if available)
 * - state: Extracted state/region (if available)
 * - country: Country name (default: "India")
 *
 * @example
 * const results = await getLocationsFromQueryThroughMapbox("barra");
 *
 * // Example output:
 * [
 *   {
 *     name: "Barrackpore, West Bengal, India",
 *     slug: "barrackpore",
 *     coordinates: {
 *       type: "Point",
 *       coordinates: [88.37, 22.76]
 *     },
 *     city: "Barrackpore",
 *     state: "West Bengal",
 *     country: "India"
 *   }
 * ]
 *
 * @remarks
 * - Uses Mapbox Geocoding API
 * - Results are ranked by relevance
 * - Coordinates are returned in [longitude, latitude] format
 * - Avoid storing results unless using permanent geocoding
 *
 * @throws Will log an error and return an empty array if the API request fails
 */
export async function getLocationsFromQueryThroughMapbox(
    query: string
): Promise<LocationSchema[]> {
    try {

        const MAPBOX_TOKEN = process.env.MAPBOX_SECRET_TOKEN;

        if (!MAPBOX_TOKEN) {
            console.warn("Mapbox token is missing");
            return [];
        }

        const response = await http.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
            {
                params: {
                    access_token: MAPBOX_TOKEN,
                    autocomplete: true,
                    limit: 10,
                    country: "in",
                    permanent: true
                },
            }
        );

        const data = response.data;

        if (!data?.features) return [];

        return data.features.map((place: any) => {
            const context = place.context || [];

            // Corrected syntax: removed extra '(' in find calls
            const city = place.place_type.includes("place")
                ? place.text
                : context.find((c: any) => c.id.includes("place"))?.text;

            const state = context.find((c: any) => c.id.includes("region"))?.text;

            const country = context.find((c: any) => c.id.includes("country"))?.text || "India";

            const name = place.place_name;

            const slug = place.text
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");

            return {
                name,
                slug,
                coordinates: {
                    type: "Point",
                    coordinates: [place.center[0], place.center[1]],
                },
                city,
                state,
                country,
            };
        });
    } catch (error) {
        console.warn("Mapbox error:", error);
        return [];
    }
}