import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class LocationRepo {
    createLocation(arg0: { name: string; slug: string; coordinates: Prisma.JsonObject; city: string | undefined; state: string | undefined; country: string; }) {
        throw new Error("Method not implemented.");
    }
    /**
     * Search locations by slug prefix (Typeahead/Autocomplete)
     */
    async getAllLocationByQuery(q: string) {
        return await prisma.searchBasedLocation.findMany({
            where: {
                slug: {
                    startsWith: q,
                    mode: "insensitive",
                },
            },
            orderBy: {
                createdAt: 'asc'
            },
            take: 10, // Limit results for performance
        });
    }

    /**
     * Get a single location by its unique Slug
     */
    async getBySlug(slug: string) {
        return await prisma.searchBasedLocation.findUnique({
            where: { slug },
        });
    }

    /**
     * Create a new location entry
     */
    async create(data: Prisma.SearchBasedLocationCreateInput) {
        return await prisma.searchBasedLocation.upsert({
            where: {
                slug: data.slug
            },
            update: {
                name: data.name,
                coordinates: data.coordinates,
                city: data.city,
                state: data.state,
                country: data.country,
            },
            create: data,
        });
    }

    /**
     * Update an existing location by ID
     */
    async update(id: string, data: Prisma.SearchBasedLocationUpdateInput) {
        return await prisma.searchBasedLocation.update({
            where: { id },
            data,
        });
    }

    /**
     * Delete a location by ID
     */
    async delete(id: string) {
        return await prisma.searchBasedLocation.delete({
            where: { id },
        });
    }

    /**
     * Advanced Search: Filter by City or State
     */
    async filterLocations(city?: string, state?: string) {
        return await prisma.searchBasedLocation.findMany({
            where: {
                city: city ? { equals: city, mode: "insensitive" } : undefined,
                state: state ? { equals: state, mode: "insensitive" } : undefined,
            },
        });
    }
}