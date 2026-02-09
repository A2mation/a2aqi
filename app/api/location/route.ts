import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { redis } from "@/lib/redis"
import { rateLimit } from "@/helpers/rateLimiter"
import { getLocationCacheKey } from "@/helpers/cashKeys"
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates"
import { resolveLocationAqi } from "@/services/resolveLocationApi"

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

    console.log(`Raw client IP: ${raw}`)

    const ip = normalizeIp(raw)

    // Local/private → fallback (Kolkata, India)
    if (!ip || isPrivateIp(ip)) return "122.163.120.226"

    return ip
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
                    lat: d.latitude.toFixed(2),
                    lng: d.longitude.toFixed(2),
                    city: d.city,
                    state: d.region,
                    country: d.country_name,
                }
                : null,
    },
    // {
    //     name: "ipwho",
    //     url: (ip: string) => `https://ipwho.is/${ip}`,
    //     normalize: (d: any) =>
    //         d?.latitude && d?.longitude
    //             ? {
    //                 lat: d.latitude,
    //                 lng: d.longitude,
    //                 city: d.city,
    //                 state: d.region,
    //                 country: d.country_name,
    //             }
    //             : null,
    // },
]

/* -----------------------------------
   GET handler
----------------------------------- */
export async function GET(req: NextRequest) {
    const ip = getClientIp(req)

    /* Rate limit */
    if (!rateLimit(ip)) {
        return new NextResponse(
            "Too many requests",
            { status: 429 }
        )
    }

    /* Try IP providers */

    for (const provider of PROVIDERS) {
        try {
            const { data } = await http.get(provider.url(ip))
            console.log(`IP location resolved via ${provider.name}`)
            const location = provider.normalize(data)
            console.log(location)
            const result = await resolveLocationAqi(location, provider.name)
            console.log(result)
            if (result) return NextResponse.json(result)
        } catch {
            continue
        }
    }


    /* -----------------------------------
      TODO:: GeoIP fallback
    ----------------------------------- */


    return new NextResponse("Internal Server Error", { status: 500 })
}
