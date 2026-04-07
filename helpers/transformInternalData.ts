import { AQIReading, AQISource } from "@prisma/client";

export const transformInternalData = (records: any[]) => {
  return records.map((data) => {

    return {
      id: data.device.id || String(data.id),
      lat: Number(data.device?.lat || data.lat),
      lng: Number(data.device?.lng || data.lng),
      aqi: Math.round(Number(data.aqi)),
      temperature: Math.round(Number(data.temperature))
    };
  });
};


export const transformInternalHistoryData = (records: any[], source: string) => {
  return records.map((data) => {
    const isAggregate = 'sumAqi' in data;
    const count = data.count || 1;

    // Helper to extract average (for aggregates) or raw (for latest)
    const getVal = (field: string) => {
      let value;
      if (isAggregate) {
        // Map standard field names to their "sum" counterparts in DailyAggregateReading
        const sumField = `sum${field.charAt(0).toUpperCase() + field.slice(1)}`;
        value = data[sumField];
      } else {
        value = data[field];
      }

      if (value === null || value === undefined) return null;
      return Number(Number(value / (isAggregate ? count : 1)).toFixed(1));
    };

    const timestamp = data.dayStart || data.updatedAt || data.createdAt || new Date();

    return {
      id: String(data.id),
      location: data.device?.loaction || data.location || "Local Area",
      city: data.device?.city || data.city || "Local City",
      state: data.state || 'Not Set Yet',
      country: "India",
      lat: Number(data.device?.lat || data.lat || 0),
      lng: Number(data.device?.lng || data.lng || 0),

      // 1-8: Core Pollution & Weather
      aqi: getVal("aqi"),
      pm25: getVal("pm25"),
      pm10: getVal("pm10"),
      no2: getVal("no2"),
      so2: getVal("so2"),
      o3: getVal("o3"),
      co: getVal("co"),
      co2: getVal("co2"),

      // 9-16: Advanced Sensors
      pm1: getVal("pm1"),
      noise: getVal("noise"),
      tvoc: getVal("tvoc"),
      smoke: getVal("smoke"),
      methane: getVal("methane"),
      h2: getVal("h2"),
      ammonia: getVal("ammonia"),
      h2s: getVal("h2s"),

      // 17-18: Environment
      temperature: getVal("temperature"),
      humidity: getVal("humidity"),

      // Meta
      source: source || "INTERNAL",
      stationId: data.device?.serialNo || null,
      measuredAt: timestamp,
    };
  });
};


export const transformInternalForNearbyLocationsData = (records: any[], state: string): AQIReading[] => {
  return records.map((data) => {
    const timestamp = data.updatedAt ? new Date(data.updatedAt) : new Date();

    return {
      id: String(data.id),
      location: data.location || `Station ${data.device?.serialNo || data.id.slice(-4)}`,
      city: data.device?.loaction || "Local Area",
      state: state,
      country: "India",
      lat: Number(data.device?.lat || data.lat),
      lng: Number(data.device?.lng || data.lng),
      
      street : data.street ? data.street : '',
      aqi: Number(Number(data.aqi).toFixed(2)),
      pm25: data.pm25 ? Number(Number(data.pm25).toFixed(2)) : null,
      pm10: data.pm10 ? Number(Number(data.pm10).toFixed(2)) : null,
      
      no2: data.no2 !== null ? Number(data.no2) : null,
      so2: data.so2 !== null ? Number(data.so2) : null,
      o3: data.o3 !== null ? Number(data.o3) : null,
      co: data.co !== null ? Number(data.co) : null,
      
      temperature: data.temperature !== null ? Number(data.temperature) : null,
      humidity: data.humidity !== null ? Number(data.humidity) : null,
      
      source: AQISource.INTERNAL, 
      stationId: data.device?.serialNo || null,
      
      measuredAt: timestamp,
      createdAt: timestamp,
    };
  });
};