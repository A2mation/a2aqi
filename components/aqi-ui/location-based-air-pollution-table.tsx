"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAQIColor, getAQIStatus } from "@/helpers/aqi-color-pallet";
import { http } from "@/lib/http";
import { useLocationStore } from "@/store/location.store";
import { Skeleton } from "../ui/skeleton";
import { AQIReading } from "@prisma/client";


type Location = {
    name: string;
    status: "Severe" | "Unhealthy";
    aqi: number;
    pm25: number;
    pm10: number;
    temp: number;
    humidity: number;
    source: string
};

type SortKey = keyof Location | null;
type SortOrder = "asc" | "desc";





export function AirPollutionTable() {
    const { lat, lng } = useLocationStore();

    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");


    useEffect(() => {
        async function fetchNearbyLocations() {
            if (lat == null || lng == null) return;

            try {
                const res = await http.get(
                    `/api/location/nearby-cities?lat=${lat}&lon=${lng}`
                );

                console.log(res)

                const normalized: Location[] = res.data.map((city: AQIReading) => ({
                    name: city.location,
                    aqi: city.aqi ?? 0,
                    status: getAQIStatus(city.aqi ?? 0),
                    pm25: city.pm25 ?? 0,
                    pm10: city.pm10 ?? 0,
                    temp: city.temperature ?? 0,
                    humidity: city.humidity ?? 0,
                    source: city.source ?? "WAQI"
                }));

                setLocations(normalized);
            } catch (err) {
                console.error("Failed to load nearby AQI data", err);
                setError("Failed to load nearby air quality data");
            } finally {
                setLoading(false);
            }
        }

        fetchNearbyLocations();
    }, [lat, lng]);


    const handleSort = (key: keyof Location) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const sortedLocations = [...locations].sort((a, b) => {
        if (!sortKey) return 0;

        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortOrder === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
    });

    const SortIcon = ({ column }: { column: keyof Location }) => {
        if (sortKey !== column) return null;
        return sortOrder === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };


    if (loading) {
        return (

            <section className="min-h-xl bg-background p-5 md:p-8">
                <div className="mx-auto max-w-7xl px-6">
                    <Skeleton className="h-150 w-80 md:w-300" />
                </div>
            </section>
        );
    }


    if (error) {
        return (
            <section className="p-8 text-red-600 font-medium">
                {error}
            </section>
        );
    }


    return (
        <section className="min-h-xl bg-background p-5 md:p-8">
            <div className="mx-auto max-w-360 px-6">
                <div className="space-y-6">
                    <div className="space-y-1 border-b-2 pb-4">
                        <h1 className="text-4xl font-bold text-balance">
                            {"Nearby Locations"}
                        </h1>
                        <p className="text-2xl text-blue-500">
                            Real-time Air Pollution Level
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="max-h-120 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-card z-10">
                                        <tr className="border-b border-border">
                                            <th onClick={() => handleSort("name")} className="px-6 py-4 text-left text-xl font-medium cursor-pointer">
                                                Location <SortIcon column="name" />
                                            </th>
                                            <th onClick={() => handleSort("status")} className="px-6 py-4 text-left text-xl font-medium cursor-pointer">
                                                Status <SortIcon column="status" />
                                            </th>
                                            <th onClick={() => handleSort("aqi")} className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                AQI (US) <SortIcon column="aqi" />
                                            </th>
                                            <th onClick={() => handleSort("pm25")} className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                PM2.5
                                            </th>
                                            <th onClick={() => handleSort("pm10")} className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                PM10
                                            </th>
                                            <th onClick={() => handleSort("temp")} className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                Temp.
                                            </th>
                                            <th onClick={() => handleSort("humidity")} className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                Humidity.
                                            </th>
                                            <th className="px-6 py-4 text-center text-xl font-medium cursor-pointer">
                                                Source
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sortedLocations.map((location, index) => (
                                            <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-6 py-4 text-lg font-medium">{location.name}</td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        style={{ backgroundColor: getAQIColor(location.aqi) }}
                                                        className="text-white text-base"
                                                    >
                                                        {location.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-base text-center">{location.aqi}</td>
                                                <td className="px-6 py-4 text-base text-center">{location.pm25}</td>
                                                <td className="px-6 py-4 text-base text-center">{location.pm10}</td>
                                                <td className="px-6 py-4 text-base text-center">{location.temp}</td>
                                                <td className="px-6 py-4 text-base text-center">{location.humidity.toFixed(1)}</td>
                                                <td className="px-6 py-4 text-base text-center">{location.source}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
