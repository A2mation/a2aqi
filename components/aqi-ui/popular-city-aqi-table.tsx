"use client";

import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import Image from 'next/image'

import { http } from "@/lib/http";
import { Card } from "@/components/ui/card";

type CityAQI = {
    location: string;
    aqi: number;
    temperature: number | null;
    humidity: number | null;
};


const landmarks: Record<string, string> = {
    Ahmedabad: "/assets/city-icons/ahmedabad.png",
    Bengaluru: "/assets/city-icons/bangalore.png",
    Chennai: "/assets/city-icons/chennai.png",
    Hyderabad: "/assets/city-icons/hyderabad.png",
    Kolkata: "/assets/city-icons/kolkata.png",
    Mumbai: "/assets/city-icons/mumbai.png",
    Delhi: "/assets/city-icons/delhi.png",
    Pune: "/assets/city-icons/pune.png",
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
            <div className="max-w-[90rem] mx-auto">
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

                            <div className="flex items-center justify-center gap-4">
                                <div className="shrink-0">

                                    <Image
                                        src={landmarks[city.location]}
                                        width={88}
                                        height={85}
                                        alt={"Location Images"}
                                    />
                                    
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
