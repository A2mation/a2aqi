import axios from "axios"
import { redis } from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server"
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates"

let geoip: any = null

async function getGeoIp() {
    if (!geoip) {
        geoip = await import("geoip-lite")
    }
    return geoip
}

/* -----------------------------------
   Axios instance
----------------------------------- */
const http = axios.create({
    timeout: 5000,
    headers: {
        "User-Agent": "AQI-App/1.0",
    },
})

const CACHE_TTL = 60 * 60 // 1 hour

/* -----------------------------------
   Simple rate limiter (per IP)
----------------------------------- */
const rateMap = new Map<string, number>()

function rateLimit(ip: string): boolean {
    const count = rateMap.get(ip) ?? 0
    if (count > 30) return false // 30 req/min
    rateMap.set(ip, count + 1)
    setTimeout(() => rateMap.delete(ip), 60_000)
    return true
}

/* -----------------------------------
   IP helpers
----------------------------------- */
function normalizeIp(ip: string | null): string | null {
    if (!ip) return null
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "")
    return ip
}

function isPrivateIp(ip: string): boolean {
    return (
        ip === "::1" ||
        ip === "127.0.0.1" ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        ip.startsWith("172.")
    )
}

function getClientIp(req: NextRequest): string {
    const raw =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip")

    const ip = normalizeIp(raw)

    // Local/private → fallback (Kolkata, India)
    if (!ip || isPrivateIp(ip)) return "122.163.120.226"

    return ip
}

/* -----------------------------------
   Redis key helper (lat/lng based)
----------------------------------- */
function getLocationCacheKey(lat: number, lng: number) {
    return `location:${lat.toFixed(4)},${lng.toFixed(4)}`
}

/* -----------------------------------
   IP location providers
----------------------------------- */
const PROVIDERS = [
    {
        name: "ipapi",
        url: (ip: string) => `https://ipapi.co/${ip}/json/`,
        normalize: (d: any) =>
            d?.latitude && d?.longitude
                ? {
                    lat: d.latitude,
                    lng: d.longitude,
                    city: d.city,
                    state: d.region,
                    country: d.country_name,
                }
                : null,
    },
    {
        name: "ipwho",
        url: (ip: string) => `https://ipwho.is/${ip}`,
        normalize: (d: any) =>
            d?.latitude && d?.longitude
                ? {
                    lat: d.latitude,
                    lng: d.longitude,
                    city: d.city,
                    state: d.region,
                    country: d.country_name,
                }
                : null,
    },
]

/* -----------------------------------
   GET handler
----------------------------------- */
export async function GET(req: NextRequest) {
    const ip = getClientIp(req)

    /* Rate limit */
    if (!rateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        )
    }

    /* Try IP providers */
    for (const p of PROVIDERS) {
        try {
            const { data } = await http.get(p.url(ip))
            const location = p.normalize(data)

            if (!location) continue

            const cacheKey = getLocationCacheKey(
                location.lat,
                location.lng
            )

            /* Cache hit (lat/lng) */
            const cached = await redis.get(cacheKey)
            if (cached) {
                return NextResponse.json({ ...cached, cached: true })
            }

            const airQualityResponse = await fetchAqiByCoordinates(
                location.lat,
                location.lng
            )

            if (airQualityResponse?.status === "ok") {
                const payload = {
                    lat: location.lat,
                    lng: location.lng,
                    city: airQualityResponse.data.city?.name,
                    state: location.state,
                    country: location.country,

                    aqi: airQualityResponse.data.aqi,
                    pm25: airQualityResponse.data.iaqi?.pm25?.v,
                    pm10: airQualityResponse.data.iaqi?.pm10?.v,
                    no2: airQualityResponse.data.iaqi?.no2?.v,
                    o3: airQualityResponse.data.iaqi?.o3?.v,
                    temp: airQualityResponse.data.iaqi?.t?.v,
                    humidity: airQualityResponse.data.iaqi?.h?.v,
                    wind: airQualityResponse.data.iaqi?.w?.v,

                    source: p.name,
                }

                await redis.set(cacheKey, payload, {
                    ex: CACHE_TTL,
                })

                return NextResponse.json(payload)
            }
        } catch {
            // try next provider
        }
    }

    /* -----------------------------------
       GeoIP fallback
    ----------------------------------- */
    try {
        const geo = await (await getGeoIp()).lookup(ip)
        if (!geo) {
            return new NextResponse("INVALID IP ADDRESS", {
                status: 400,
            })
        }

        const location = {
            lat: geo.ll[0],
            lng: geo.ll[1],
            city: geo.city,
            state: geo.region,
            country: geo.country,
        }

        const cacheKey = getLocationCacheKey(
            location.lat,
            location.lng
        )

        const cached = await redis.get(cacheKey)
        if (cached) {
            return NextResponse.json({ ...cached, cached: true })
        }

        const airQualityResponse = await fetchAqiByCoordinates(
            location.lat,
            location.lng
        )

        if (airQualityResponse?.status === "ok") {
            const payload = {
                lat: location.lat,
                lng: location.lng,
                city: airQualityResponse.data.city?.name,
                state: location.state,
                country: location.country,

                aqi: airQualityResponse.data.aqi,
                pm25: airQualityResponse.data.iaqi?.pm25?.v,
                pm10: airQualityResponse.data.iaqi?.pm10?.v,
                no2: airQualityResponse.data.iaqi?.no2?.v,
                o3: airQualityResponse.data.iaqi?.o3?.v,
                temp: airQualityResponse.data.iaqi?.t?.v,
                humidity: airQualityResponse.data.iaqi?.h?.v,
                wind: airQualityResponse.data.iaqi?.w?.v,

                source: "geoip-lite",
            }

            await redis.set(cacheKey, payload, {
                ex: CACHE_TTL,
            })

            return NextResponse.json(payload)
        }
    } catch {
        return new NextResponse("IP not found", { status: 404 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
}
