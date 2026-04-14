'use client'

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { useLocationStore } from "@/store/location.store"
import { detectGpsLocation, detectIpLocation } from "@/store/location.actions";

export type AQIMarker = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
    status: string;
    pm25: number;
    pm10: number;
    temp: number;
    humidity: number;
    source: string;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
};

const MapSkeleton = () => (
    <div className="h-[calc(100vh-100px)] mt-20 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
);

const Map = dynamic(() => import("./components/map"), {
    ssr: false,
    loading: () => <MapSkeleton />
});

const AirQualityPage = () => {
    const [mounted, setMounted] = useState(false)
    const {
        lat,
        lng,
    } = useLocationStore();

    useEffect(() => {
        setMounted(true)
        const initLocation = async () => {
            if (!lat || !lng) {
                await detectIpLocation();
            }
        };

        initLocation();
    }, [lat, lng]);

    if (!mounted) return (
        <>
            <div className="min-h-screen p-8">
                <MapSkeleton />
            </div>
        </>
    )

    return (
        <>
            <Map
                lat={lat}
                lng={lng}
            />

        </>
    )
}
export default AirQualityPage
