export type SensorPayload = {
    serialNo: string;
    measuredAt?: string;

    aqi?: number;
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
};


export type SensorJob = {
    sensorId: string;
    timestamp: string;

    pm25: number;
    pm10: number;

    co2?: number;
    temp?: number;
    humidity?: number;
};
