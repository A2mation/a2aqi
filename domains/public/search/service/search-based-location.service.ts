import { Prisma } from "@prisma/client";

import { LocationRepo } from "../repo/search-based-location.repo";
import { getLocationsFromQueryThroughMapbox, LocationSchema } from "@/services/location-mapbox/fetch-location-from-mapbox";

export class LocationService {
    private repo: LocationRepo;

    constructor() {
        this.repo = new LocationRepo();
    }

    /**
     * Fetch locations based on search query if found in db then return or get form the mapbox and save
     */
    async searchLocations(query: string): Promise<LocationSchema[]> {
        if (!query || query.length < 2) return [];

        // Check local DB first
        const localLocations = await this.repo.getAllLocationByQuery(query);

        // If no results found, fetch from Mapbox and store using the service method
        if (localLocations.length < 1) {
            // console.log('Execute MapBox API')
            const mapboxResults = await getLocationsFromQueryThroughMapbox(query);

            if (mapboxResults.length > 0) {
                await Promise.all(
                    mapboxResults.map((loc) =>
                        this.createLocation({
                            name: loc.name,
                            slug: loc.slug,
                            lng: loc.coordinates.coordinates[0],
                            lat: loc.coordinates.coordinates[1],
                            city: loc.city,
                            state: loc.state,
                        }).catch(() => null) // Ignore duplicates
                    )
                );

                return mapboxResults;
            }
            return [];
        }
        // console.log('Execute DATABASE API')
        // Return existing data mapped to LocationSchema
        return localLocations.map(loc => ({
            name: loc.name,
            slug: loc.slug,
            coordinates: loc.coordinates as LocationSchema["coordinates"],
            city: loc.city || undefined,
            state: loc.state || undefined,
            country: loc.country || "India"
        }));
    }

    /**
     * Create a location with logic to ensure slug uniqueness or formatting
     * Now properly used as the primary insertion point
     */
    async createLocation(data: {
        name: string;
        slug: string;
        lat: number;
        lng: number;
        city?: string;
        state?: string;
    }) {
        return await this.repo.create({
            name: data.name,
            slug: data.slug,
            coordinates: {
                type: "Point",
                coordinates: [data.lng, data.lat]
            } as Prisma.JsonObject,
            city: data.city,
            state: data.state,
            country: "India",
        });
    }

    /**
     * Get a specific location by its slug
     */
    async getLocationDetails(slug: string) {
        const location = await this.repo.getBySlug(slug);
        if (!location) {
            throw new Error(`Location with slug "${slug}" not found.`);
        }
        return {
            name: location.name,
            slug: location.slug,
            coordinates: location.coordinates as LocationSchema["coordinates"],
            city: location.city || undefined,
            state: location.state || undefined,
            country: location.country || "India"
        };
    }


    /**
     * Get a specific location by its City
     */
    async getLocationDetailsbyCity(city: string) {

        const location = await this.repo.getByCity(city);
        if (!location) {
            throw new Error(`Location with slug "${city}" not found.`);
        }

        return {
            name: location.name,
            slug: location.slug,
            coordinates: location.coordinates as LocationSchema["coordinates"],
            city: location.city || undefined,
            state: location.state || undefined,
            country: location.country || "India"
        };
    }

    /**
     * Update location details
     */
    async updateLocation(id: string, updateData: Partial<Prisma.SearchBasedLocationUpdateInput>) {
        return await this.repo.update(id, updateData);
    }

    /**
     * Remove a location
     */
    async deleteLocation(id: string) {
        return await this.repo.delete(id);
    }

    /**
     * Fetch locations filtered by region
     */
    async getLocationsByRegion(city?: string, state?: string) {
        return await this.repo.filterLocations(city, state);
    }
}