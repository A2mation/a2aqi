import { http } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates";

type GeoNamesCity = {
    name: string;
    lat: string;
    lng: string;
    population: number;
    countryName: string;
    fcode: string;
};

function haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function cityScore(city: GeoNamesCity): number {
    let score = 0;

    if (city.population > 1_000_000) score += 5;
    if (city.population > 5_000_000) score += 5;
    if (city.fcode === "PPLC") score += 10; // capital

    return score;
}

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);
        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");

        if (!lat || !lon) {
            return new NextResponse(
                "lat and lon are required",
                { status: 400 }
            );
        }

        const username = process.env.GEONAMES_USERNAME;
        if (!username) {
            return new NextResponse(
                "GeoNames username missing",
                { status: 500 }
            );
        }

        const geoNamesURL =
            `http://api.geonames.org/findNearbyPlaceNameJSON` +
            `?lat=${lat}` +
            `&lng=${lon}` +
            `&cities=5000` +
            `&radius=50` +
            `&maxRows=15` +
            `&username=${username}`;



        const response = await http.get(geoNamesURL);
        const data = response.data;
        // console.log("GeoNames response:", data);
        
        const cities = (data.geonames as GeoNamesCity[]).map((city) => ({
            name: city.name,
            country: city.countryName,
            lat: Number(city.lat),
            lon: Number(city.lng),
            population: city.population,
            distanceKm: haversine(
                Number(lat),
                Number(lon),
                Number(city.lat),
                Number(city.lng)
            ),
            score: cityScore(city),
        }));
        
        const rankedCities = cities
        .sort((a, b) => b.score - a.score || a.distanceKm - b.distanceKm)
        .slice(0, 6);
        
        

        const citiesWithAqi = await Promise.all(
            rankedCities.map(async (city) => {
                const aqi = await fetchAqiByCoordinates(city.lat, city.lon);
                return {
                    ...city,
                    aqi,
                };
            })
        );

        return NextResponse.json(citiesWithAqi);
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
