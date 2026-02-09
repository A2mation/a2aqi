import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { redis } from "@/lib/redis"
import { rateLimit } from "@/helpers/rateLimiter"
import { prisma } from "@/lib/prisma"
import { getLocationCacheKey } from "@/helpers/cashKeys"
import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates"
import { resolveLocationAqi } from "@/services/resolveLocationApi"
import { haversine } from "@/helpers/haversine"
import { AQIReading } from "@prisma/client"

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
    try {
        const ip = getClientIp(req)

        if (!rateLimit(ip)) {
            return new NextResponse("Too many requests", { status: 429 })
        }

        const { searchParams } = new URL(req.url)
        const latParam = searchParams.get("lat")
        const lonParam = searchParams.get("lng")
        // console.log(`Received location request from IP: ${ip} with params lat=${latParam}, lon=${lonParam}`)

        let lat: number
        let lng: number

        // If params exist, use them
        if (latParam && lonParam) {
            lat = Number(latParam)
            lng = Number(lonParam)

            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                return new NextResponse("Invalid lat/lon params", { status: 400 })
            }
        } else {
            // Else fallback to IP based location
            console.log(`No lat/lng params, resolving location for IP: ${ip}`)
            const { data } = await http.get(PROVIDERS[0].url(ip))
            console.log(data)
            const location = PROVIDERS[0].normalize(data)
            // console.log(`IP-based location for IP ${ip}:`, location)
            if (!location) {
                return new NextResponse("Location not found", { status: 404 })
            }

            lat = Number(location.lat)
            lng = Number(location.lng)

            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                return new NextResponse("Invalid location coordinates", { status: 500 })
            }
        }

        const radiusKm = 200

        const latDelta = radiusKm / 111
        const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180))

        const candidates = await prisma.aQIReading.findMany({
            where: {
                lat: { gte: lat - latDelta, lte: lat + latDelta },
                lng: { gte: lng - lngDelta, lte: lng + lngDelta },
            },
            take: 300,
        })

        const nearest = candidates.reduce((best, curr) => {
            const dist = haversine(lat, lng, curr.lat, curr.lng)

            if (!best || dist < best.dist) return { curr, dist }
            return best
        }, null as null | { curr: AQIReading; dist: number })

        if (!nearest) {
            return new NextResponse("No nearby AQI data", { status: 404 })
        }

        return NextResponse.json(nearest.curr)
    } catch (error: any) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

