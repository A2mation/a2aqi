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


export interface DailyStats {
    date: string;
    aqi: number;
    pm10: number;
    pm25: number;
    so2: number;
    no2: number;
    co2: number;
    co: number;
    o3: number;
    noise: number;
    pm1: number;
    tvoc: number;
    smoke: number;
    methane: number;
    h2: number;
    ammonia: number;
    h2s: number;
    temperature: number;
    humidity: number;
}


export type DashboardParams =
    | { type: 'day'; dayStart: string }
    | { type: 'week'; dateStr: string }
    | { type: 'month'; year: number; month: number }
    | { type: 'custom'; dateStr: string, day: number};