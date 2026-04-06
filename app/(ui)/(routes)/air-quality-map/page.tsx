'use client'

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { useLocationStore } from "@/store/location.store"
import { detectIpLocation } from "@/store/location.actions";

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
