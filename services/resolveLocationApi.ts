import { NextResponse } from "next/server"

import { redis } from "@/lib/redis"

import { getLocationCacheKey } from "@/helpers/cashKeys"
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates"
import { LOCATION_CACHE_TTL } from "@/constant/location-cache-TTL"

export async function resolveLocationAqi(location: any, source: string) {
    if (!location) return null
    console.log(`Resolving AQI for location: ${location.lat}, ${location.lng} (Source: ${source})`)

    const cacheKey = getLocationCacheKey(location.lat, location.lng)

    const cached = await redis.get(cacheKey)
    if (cached) {
        return NextResponse.json({ ...JSON.parse(cached), cached: true })
    }

    const airQualityResponse = await fetchAqiByCoordinates(location.lat, location.lng)
    console.log(airQualityResponse)

    if (airQualityResponse?.status !== "ok") return null

    const payload = {
        lat: location.lat,
        lng: location.lng,
        city: location.city,
        state: location.state,
        country: location.country,

        aqi: airQualityResponse.data.aqi,
        pm25: airQualityResponse.data.iaqi?.pm25?.v,
        pm10: airQualityResponse.data.iaqi?.pm10?.v,
        no2: airQualityResponse.data.iaqi?.no2?.v,
        o3: airQualityResponse.data.iaqi?.o3?.v,
        so2: airQualityResponse.data.iaqi?.so2?.v,
        co: airQualityResponse.data.iaqi?.co?.v,
        temp: airQualityResponse.data.iaqi?.t?.v,
        humidity: airQualityResponse.data.iaqi?.h?.v,
        wind: airQualityResponse.data.iaqi?.w?.v,

        source,
    }

    await redis.set(cacheKey, JSON.stringify(payload), "EX", LOCATION_CACHE_TTL)

    return NextResponse.json(payload)
}
