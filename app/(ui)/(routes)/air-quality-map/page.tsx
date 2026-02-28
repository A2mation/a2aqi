'use client'

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { http } from "@/lib/http";
import { detectIpLocation } from "@/store/location.actions";
import { useLocationStore } from "@/store/location.store"
import { getAQIStatus } from "@/helpers/aqi-color-pallet";
import { useQuery } from "@tanstack/react-query";

export type AQIMarker = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
    status: string;      // Add this
    pm25: number;
    pm10: number;
    temp: number;        // Add this
    humidity: number;    // Add this
    source: string;      // Add this
    // If you plan to use these later, add them as optional:
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
};

const Map = dynamic(() => import("./components/map"), { ssr: false })

const AirQualityPage = () => {
    const [mounted, setMounted] = useState(false)
    const {
        lat,
        lng,
    } = useLocationStore();

    useEffect(() => {
        setMounted(true)
        if (lat == null && lng == null) {
            detectIpLocation();
        }
    }, [lat, lng])

    if (!mounted) return null

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
