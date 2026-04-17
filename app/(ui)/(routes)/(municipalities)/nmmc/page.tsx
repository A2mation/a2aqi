'use client'

import dynamic from "next/dynamic"

import { useEffect, useState } from "react"


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

const Map = dynamic(() => import("../components/Map"), {
    ssr: false,
    loading: () => <MapSkeleton />
});

const AirQualityPage = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) return (
        <>
            <div className="min-h-screen p-8">
                <MapSkeleton />
            </div>
        </>
    )


    return (
        <>
            <section className="relative min-h-screen bg-slate-50 overflow-hidden font-sans">
                {/* Header Section */}
                <div className="relative z-10 h-[12dvh] md:h-[15dvh] mt-10 flex flex-col justify-center px-8 pb-0 md:px-10 lg:px-10 bg-linear-to-b from-white to-transparent">
                    
                    <h1 className="text-2xl underline md:text-3xl lg:text-4xl text-center font-extrabold tracking-tight text-slate-900 leading-tight">
                        Navi Mumbai 
                        <span className="text-transparent bg-clip-text pl-2 bg-linear-to-r from-blue-700 to-indigo-500">
                            Municipal Corporation
                        </span>
                    </h1>
                </div>

                {/* Map Container */}
                <div className="relative h-[78dvh] mx-4 md:mx-12 mb-12 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 bg-white">
                    <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Interactive Jurisdiction Map
                        </p>
                    </div>

                    {/* The Map Component */}
                    <div className="w-full h-full grayscale-20 hover:grayscale-0 transition-all duration-700">
                        <Map />
                    </div>
                </div>
            </section>
        </>
    )
}
export default AirQualityPage
