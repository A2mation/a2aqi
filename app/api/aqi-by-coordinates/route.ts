import { fetchAqiByCoordinates } from "@/services/air-quality/fetchAqiByCoordinates";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return NextResponse.json(
            { error: "lat and lon are required" },
            { status: 400 }
        );
    }

    try {
        const waqi = await fetchAqiByCoordinates(lat, lon);

        return NextResponse.json({
            aqi: waqi?.data.aqi,
            pm25: waqi?.data.iaqi?.pm25?.v ?? null,
            pm10: waqi?.data.iaqi?.pm10?.v ?? null,
            no2: waqi?.data.iaqi?.no2?.v ?? null,
            o3: waqi?.data.iaqi?.o3?.v ?? null,
            city: waqi?.data.city?.name ?? null
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
