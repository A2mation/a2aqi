import { http } from "@/lib/http"
import { redis } from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server"

import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates"
import { getNearbyCitiesCacheKey } from "@/helpers/cashKeys"
import { rateLimit } from "@/helpers/rateLimiter"
import { prisma } from "@/lib/prisma"
import { normalizeCachedCities } from "@/helpers/normalizeCachedCities"
import { haversine } from "@/helpers/haversine"


const CACHE_TTL = 60 * 60 // 1 hour



function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    )
}



export async function GET(req: NextRequest) {
    try {
        const ip = getClientIp(req)

        /* Rate limit */
        if (!rateLimit(ip)) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        const { searchParams } = new URL(req.url)
        const lat = searchParams.get("lat")
        const lon = searchParams.get("lon")

        if (!lat || !lon) {
            return new NextResponse("lat and lon are required", {
                status: 400,
            })
        }


        const latNum = Math.round(Number(lat) * 100) / 100
        const lonNum = Math.round(Number(lon) * 100) / 100

        const radiusKm = 200;
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos((latNum * Math.PI) / 180));

        // TODO: Caching layer here - store recent queries in Redis with a TTL, key by rounded lat/lon

        const candidates = await prisma.aQIReading.findMany({
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
            orderBy: { createdAt: "desc" },
            take: 20,
        });


        const nearest10 = candidates
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
            .slice(0, 10);

        return NextResponse.json(nearest10);

    } catch {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


// const cacheKey = getNearbyCitiesCacheKey(Number(lat), Number(lon))

// /* Redis cache hit */
// const cached = await redis.get(cacheKey) as object
// if (cached) {
//     const cities = normalizeCachedCities(cached)

//     return NextResponse.json(cities)

// }

// const username = process.env.GEONAMES_USERNAME
// if (!username) {
//     return new NextResponse("GeoNames username missing", {
//         status: 500,
//     })
// }

// const geoNamesURL =
//     `http://api.geonames.org/findNearbyPlaceNameJSON` +
//     `?lat=${lat}` +
//     `&lng=${lon}` +
//     `&cities=5000` +
//     `&radius=50` +
//     `&maxRows=15` +
//     `&username=${username}`

// const response = await http.get(geoNamesURL)
// const data = response.data

// const cities = (data.geonames as GeoNamesCity[]).map((city) => ({
//     name: city.name,
//     country: city.countryName,
//     lat: Number(city.lat),
//     lon: Number(city.lng),
//     population: city.population,
//     distanceKm: haversine(
//         Number(lat),
//         Number(lon),
//         Number(city.lat),
//         Number(city.lng)
//     ),
//     score: cityScore(city),
// }))

// // const rankedCities = cities
// //     .sort((a, b) => b.score - a.score || a.distanceKm - b.distanceKm)
// //     .slice(0, 6)

// const citiesWithAqi = await Promise.all(
//     cities.map(async (city) => {
//         const aqi = await fetchAqiByCoordinates(city.lat, city.lon)
//         return {
//             ...city,
//             aqi,
//         }
//     })
// )

// /* Save to Redis */
// await redis.set(cacheKey, citiesWithAqi, {
//     ex: CACHE_TTL,
// })