"use client";

import { JSX, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CircleHelp } from "lucide-react";
import { http } from "@/lib/http";

type CityAQI = {
    location: string;
    aqi: number;
    temperature: number | null;
    humidity: number | null;
};


const landmarks: Record<string, JSX.Element> = {
    Ahmedabad: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M50 20 L70 40 L70 75 L30 75 L30 40 Z" />
            <circle cx="50" cy="35" r="8" />
            <path d="M42 35 L58 35 M50 27 L50 43" />
            <rect x="40" y="60" width="20" height="15" />
        </svg>
    ),
    Bengaluru: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M30 75 L30 40 L50 25 L70 40 L70 75" />
            <circle cx="50" cy="35" r="10" />
            <rect x="40" y="55" width="20" height="20" />
            <path d="M25 75 L75 75" />
        </svg>
    ),
    Chennai: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M50 20 L50 75" />
            <path d="M35 30 L65 30 M30 40 L70 40 M25 50 L75 50 M30 60 L70 60 M35 70 L65 70" />
            <circle cx="50" cy="25" r="5" />
        </svg>
    ),
    Hyderabad: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M30 75 L30 50 L50 35 L70 50 L70 75" />
            <circle cx="50" cy="30" r="8" />
            <rect x="40" y="60" width="20" height="15" />
        </svg>
    ),
    Kolkata: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="35" y="50" width="30" height="25" />
            <path d="M30 50 L50 30 L70 50" />
        </svg>
    ),
    Mumbai: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M30 75 L30 45 M70 75 L70 45" />
            <path d="M30 45 L50 25 L70 45" />
        </svg>
    ),
    Delhi: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M50 25 L50 75" />
            <path d="M30 40 L70 40 M30 50 L70 50 M30 60 L70 60" />
        </svg>
    ),
    Pune: (
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="45" r="20" />
            <rect x="40" y="60" width="20" height="15" />
        </svg>
    ),
};


function getAQIColor(aqi: number) {
    if (aqi <= 50) return "text-green-500";
    if (aqi <= 100) return "text-yellow-500";
    if (aqi <= 150) return "text-orange-500";
    if (aqi <= 200) return "text-red-500";
    return "text-purple-600";
}


export default function PopularCityCards() {
    const [cities, setCities] = useState<CityAQI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await http.get("/api/aqi/popular-city-aqi");
                setCities(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load AQI data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="p-6 animate-pulse h-48 bg-gray-100" />
                ))}
            </div>
        );
    }

    
    if (error) {
        return (
            <div className="p-8 text-red-600 font-medium">
                {error}
            </div>
        );
    }

    
    return (
        <main className="min-h-xl p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 border-b-2 pb-4">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1">
                        India&apos;s Metro Cities
                    </h1>
                    <h2 className="text-xl text-blue-600">
                        Air Quality Index
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cities.map((city) => (
                        <Card
                            key={city.location}
                            className="relative p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-2 border-gray-200"
                        >
                            <div className="absolute top-4 right-4">
                                <div className="bg-gray-800 text-white rounded-full p-1">
                                    <CircleHelp className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    {landmarks[city.location]}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {city.location}
                                    </h3>

                                    <div className={`text-5xl font-bold ${getAQIColor(city.aqi)} mb-4`}>
                                        {city.aqi}
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 mb-1">Temp.</div>
                                            <div className="text-gray-900 font-medium">
                                                {city.temperature?.toFixed(1) ?? "--"}°C
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Hum.</div>
                                            <div className="text-gray-900 font-medium">
                                                {city.humidity?.toFixed(1) ?? "--"}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
