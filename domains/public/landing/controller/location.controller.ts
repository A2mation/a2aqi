import { NextRequest, NextResponse } from "next/server";

import { http } from "@/lib/http";
import { redis } from "@/lib/redis";
import { rateLimit } from "@/helpers/rateLimiter";
import { IPServices } from "../service/ip.service";
import { getLocationCacheKey } from "@/helpers/cashKeys";
import { PollutantServices } from "../service/pollutants.service";
import { NearByCitiesService } from "../service/nearbycities.service";
import { PollutantMajorCitiesService } from "../service/pollutant.majorcities.service";
import { AQIHistoryService } from "../service/aqi-history.service";

export class LocationController {

    private ipServiceObj = new IPServices();
    private pollutantServiceObj = new PollutantServices();
    private PollutantMajorCitiesServiceObj = new PollutantMajorCitiesService();
    private NearByCitiesObj = new NearByCitiesService();
    private HistoryhObj = new AQIHistoryService();
    private CACHE_TTL = 60 * 5; // 5 mins


    public async locationController(req: NextRequest) {
        const ip = this.ipServiceObj.getClientIp(req);

        if (!rateLimit(ip)) {
            return new NextResponse("Too many requests", { status: 429 })
        }


        const { searchParams } = new URL(req.url);
        const latParam = searchParams.get("lat");
        const lonParam = searchParams.get("lng");

        let lat: number;
        let lng: number;

        if (latParam && lonParam) {
            lat = Number(latParam)
            lng = Number(lonParam)

            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                return new NextResponse("Invalid lat/lon params", { status: 400 })
            }
        } else {

            const { data } = await http.get(PROVIDERS[0].url(ip))

            const location = PROVIDERS[0].normalize(data)

            if (!location) {
                return new NextResponse("Location not found", { status: 404 })
            }

            lat = Number(location.lat)
            lng = Number(location.lng)

            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                return new NextResponse("Invalid location coordinates", { status: 500 })
            }
        }
        const CACHE_KEY = getLocationCacheKey(lat, lng);
        const cached = await redis.get(CACHE_KEY);

        if (cached) {
            return NextResponse.json(JSON.parse(cached), {
                status: 200
            });
        }


        const nearest = await this.pollutantServiceObj.getNearestLocationData(lat, lng);

        if (!nearest) {
            return NextResponse.json({
                message: "No nearby AQI data",
                success: false
            }, { status: 404 })
        };

        const popularCities = await this.PollutantMajorCitiesServiceObj.majorCitiesPollutantData();
        const nearbyCities = await this.NearByCitiesObj.nearbyCitiesService(lat, lng);
        

        await redis.set(CACHE_KEY, JSON.stringify({
            nearest: nearest.curr,
            popularCities: popularCities,
            nearbyCities: nearbyCities,
            success: true
        }), "EX", this.CACHE_TTL);

        return NextResponse.json({
            nearest: nearest.curr,
            popularCities: popularCities,
            nearbyCities: nearbyCities,
            success: true
        });
    }
}



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
    // Can add more fallback providers
]