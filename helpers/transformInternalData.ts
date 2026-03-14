import { AQIReading, AQISource } from "@prisma/client";

export const transformInternalData = (records: any[], state: string): AQIReading[] => {
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