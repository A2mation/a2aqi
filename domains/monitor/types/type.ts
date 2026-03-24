export type HeatmapRow = {
    date: string;
    hour: number;

    aqi: number | null;
    pm10: number | null;
    pm25: number | null;
    so2: number | null;
    no2: number | null;
    co2: number | null;
    co: number | null;
    o3: number | null;
    noise: number | null;
    pm1: number | null;
    tvoc: number | null;
    smoke: number | null;
    methane: number | null;
    h2: number | null;
    ammonia: number | null;
    h2s: number | null;
    temperature: number | null;
    humidity: number | null;
};

export type HeatmapSlot = {
    time: string;
    aqi?: number | null;
    pm10?: number | null;
    pm25?: number | null;
    so2?: number | null;
    no2?: number | null;
    co2?: number | null;
    co?: number | null;
    o3?: number | null;
    noise?: number | null;
    pm1?: number | null;
    tvoc?: number | null;
    smoke?: number | null;
    methane?: number | null;
    h2?: number | null;
    ammonia?: number | null;
    h2s?: number | null;
    temperature?: number | null;
    humidity?: number | null;
    data?: null;
};

export type HeatmapDay = {
    date: string;
    slots: HeatmapSlot[];
};