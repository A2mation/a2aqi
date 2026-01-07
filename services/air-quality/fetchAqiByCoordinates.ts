import { http } from "@/lib/http";

export type WaqiResponse = {
    status: "ok" | "error";
    data: {
        aqi: number;
        idx: number;
        iaqi?: {
            pm25?: { v: number };
            pm10?: { v: number };
            no2?: { v: number };
            o3?: { v: number };
            co?: { v: number };
            so2?: { v: number };
            t?: { v: number };
            h?: { v: number };
            w?: { v: number };
        };
        city?: {
            name: string;
            geo: [number, number];
        };
    };
};

export async function fetchAqiByCoordinates(
    lat: number,
    lon: number
): Promise<WaqiResponse | null> {
    const token = process.env.WAQI_TOKEN;
    if (!token) throw new Error("WAQI_TOKEN is missing");

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

    const res = await http.get(url);
    const data = res.data as WaqiResponse;

    if (!data || data.status !== "ok") {
        return null; // IMPORTANT: don't throw, allow filtering
    }

    return data;
}
