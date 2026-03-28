import { DeviceStatus, latestSensorReading } from "@prisma/client"

export interface MonitorAnalyticsDevice {
    id: string,
    lat: number,
    lng: number,
    name: string | null
    serialNo: string,
    status: DeviceStatus,
    model: {
        name: string
    },
    location: string
}

type Slot = EmptySlot | DataSlot;

interface EmptySlot {
    time: string;
    data: null;
}

interface DataSlot {
    time: string;
    date: string;
    hour: number;
    aqi: number;
    pm10?: number;
    pm25?: number;
    so2?: number;
    no2?: number;
    co2?: number;
    co?: number;
    o3?: number;
    noise?: number;
    pm1?: number;
    tvoc?: number;
    smoke?: number;
    methane?: number;
    h2?: number;
    ammonia?: number;
    h2s?: number;
    temperature?: number;
    humidity?: number;
}

export interface DaysReading {
    date: string;
    aqi: number;
    pm10?: number;
    pm25?: number;
    so2?: number;
    no2?: number;
    co2?: number;
    co?: number;
    o3?: number;
    noise?: number;
    pm1?: number;
    tvoc?: number;
    smoke?: number;
    methane?: number;
    h2?: number;
    ammonia?: number;
    h2s?: number;
    temperature?: number;
    humidity?: number;
}

export interface AnalyticsResponse {
    device: MonitorAnalyticsDevice
    hourly: {
        data: string;
        slots: Slot[];
    }[],
    latestReading: latestSensorReading,
    last30Days: DaysReading[]
}
