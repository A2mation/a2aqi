import axios from "axios"
import { redis } from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server"

let geoip: any = null

async function getGeoIp() {
    if (!geoip) {
        geoip = await import("geoip-lite")
    }
    return geoip
}


const http = axios.create({
    timeout: 5000,
    headers: {
        "User-Agent": "AQI-App/1.0",
    },
})

const CACHE_TTL = 60 * 60 // 1 hour


//Simple rate limiter (per IP)
const rateMap = new Map<string, number>()

function rateLimit(ip: string): boolean {
    const count = rateMap.get(ip) ?? 0
    if (count > 30) return false // 30 req/min
    rateMap.set(ip, count + 1)
    setTimeout(() => rateMap.delete(ip), 60_000)
    return true
}


//IP helpers
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
    // console.log("Raw Client IP:", ip);

    // Local / private → dev-safe public fallback
    if (!ip || isPrivateIp(ip)) return "122.163.120.226" // Example: Kolkata, India

    return ip
}


//   IP providers
const PROVIDERS = [
    {
        name: "ipapi",
        url: (ip: string) => `https://ipapi.co/${ip}/json/`,
        normalize: (d: any) =>
            d?.latitude && d?.longitude
                ? { lat: d.latitude, lng: d.longitude, city: d.city, state: d.region, country: d.country_name }
                : null,
    },
    {
        name: "ipwho",
        url: (ip: string) => `https://ipwho.is/${ip}`,
        normalize: (d: any) =>
            d?.latitude && d?.longitude
                ? { lat: d.latitude, lng: d.longitude, city: d.city, state: d.region, country: d.country_name }
                : null,
    },
]


//   GET handler
export async function GET(req: NextRequest) {
    const ip = getClientIp(req)

    /* Rate limiting */
    if (!rateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        )
    }

    // Cache settings
    const cacheKey = `ip-location:${ip}`

    const cached = await redis.get(cacheKey)

    /* Cache hit */
    if (cached) {
        return Response.json({ ...cached, cached: true })
    }

    /* Provider lookup */
    for (const p of PROVIDERS) {
        try {
            const { data } = await http.get(p.url(ip))
            let location = p.normalize(data)
            // console.log("ip", ip)

            if (location) {
                const response = { ...location, source: p.name }

                // Save to cache
                await redis.set(cacheKey, response, { ex: CACHE_TTL })

                return NextResponse.json(response)
            }

            const geo = await (await getGeoIp()).lookup(ip);
            console.log("GeoIP lookup:", geo);

            if (!geo) {
                return new NextResponse('INVALID IP ADDRESS', { status: 400 });
            }
            location = {
                lat: geo.ll[0],
                lng: geo.ll[1],
                city: geo.city,
                state: geo.region,
                country: geo.country,
            }

            const response = { ...location, source: "aqiindia" };

            await redis.set(cacheKey, response, { ex: CACHE_TTL });

            return NextResponse.json(response);

        } catch {
            // Try next provider silently
            return new NextResponse('IP not found', { status: 404 });
        }
    }

    return new NextResponse('Internal Server Error', { status: 500 });
}
