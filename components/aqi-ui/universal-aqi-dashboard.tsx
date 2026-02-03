"use client"

import { useEffect, useState } from "react"
import {
    Share2,
    Cloud,
    Droplets,
} from "lucide-react"
import Image from 'next/image'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AQITheme, getAQITheme } from "@/helpers/aqi-color-pallet"
import { AQIScale } from "./aqi-scale"
import { cn } from "@/lib/utils"
import { SparklesCore } from "../ui/sparkles"
import { BackgroundGradient } from "../ui/background-gradient"
import { ShareDialog } from "@/components/Share-Button";
import { ViewMapsButton } from "../ViewMapsButton"
import DynamicPagination from "../Pagination-Dynamic"
import { Badge } from "../ui/badge";
import { formatTime } from "@/helpers/time";
import { formatPlaceName } from "@/helpers/format-place-name";
import AirQualityIndexTable from "./air-quality-index-table";
import { AirPollutionTable } from "./location-based-air-pollution-table";
import PopularCityCards from "./popular-city-aqi-table";


interface AQIAverages {
    aqi: number | null
    pm10: number | null
    pm25: number | null
    temperature: number | null
    humidity: number | null
    city?: string
    state?: string
    country: string
}

interface AQIData {
    averages: AQIAverages
}

interface UniversalAQIDashboardProps {
    data: AQIData
}

export function UniversalAQIDashboard({ data }: UniversalAQIDashboardProps) {
    // console.log(data)
    const { averages } = data

    const [open, setOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)


    const [theme, setTheme] = useState<AQITheme>({
        label: "Unknown",
        color: "#9CA3AF",
        borderClass: "border-gray-200 dark:border-gray-800",
        bg: "from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900",
        text: "text-gray-700 dark:text-gray-300",
        card: "bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md",

    })

    const AirQualityImages: Record<string, string> = {
        Good: "/assets/aqi-moods/Good.png",
        Moderate: "/assets/aqi-moods/Moderate.png",
        Poor: "/assets/aqi-moods/Poor.png",
        Unhealthy: "/assets/aqi-moods/Unhealthy.png",
        Severe: "/assets/aqi-moods/Severe.png",
        Hazardous: "/assets/aqi-moods/Hazard.png",
    };



    useEffect(() => {
        if (data) {
            setLastUpdated(new Date())
        }
    }, [data])



    useEffect(() => {
        if (typeof averages.aqi === "number") {
            setTheme(getAQITheme(averages.aqi))
        }
    }, [averages.aqi])
    const moodImage = AirQualityImages[theme.label]

    if (!averages) {
        return null
    }



    return (
        <>
            <div className="min-h-screen mt-40 bg-background ">

                {/* Dashboard */}
                <div className="max-w-[100rem] h-full mx-auto px-4 -mt-32 relative z-10 pb-12">
                    <Card className={` border `}>
                        <DynamicPagination
                            items={[
                                slugify(averages.country),
                                averages.state && slugify(averages.state),
                                averages.city && slugify(averages.city),
                            ].filter((item): item is string => !!item)}
                        />




                        <div className="p-6 sm:p-8 lg:p-10">
                            <Badge variant={"destructive"} className="text-lg rounded-sm px-2">
                                <div className="flex items-center gap-2">
                                    <span className="relative inline-flex size-2 rounded-full bg-white"></span>
                                    Live
                                </div>
                            </Badge>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
                                <div className="flex gap-y-2 flex-col">
                                    <h1 className="text-3xl md:text-5xl py-4 font-semibold">
                                        {formatPlaceName(
                                            averages.city ?? averages.state ?? averages.country ?? ""
                                        )}

                                        {" "} Air Quality Index (AQI)
                                    </h1>

                                    <div className="text-sm md:text-lg text-muted-foreground">
                                        {lastUpdated && (
                                            <>Last updated: {formatTime(lastUpdated)} GMT+0530 (India Standard Time)</>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <span className="text-sm pr-2">
                                            Powered by A2mation
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Map Button – Primary Action */}
                                    <a href="/air-quality-map">
                                        <ViewMapsButton />
                                    </a>

                                    {/* Share Button */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => setOpen(true)}
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-xl border-blue-300
                                                transition-all duration-300
                                                hover:bg-blue-50 hover:text-blue-600
                                                hover:scale-110 hover:shadow-md"
                                                >
                                                    <Share2 className="h-5 w-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">Share</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <ShareDialog open={open} onOpenChange={setOpen} />
                                </div>

                            </div>

                            {/* Main Grid */}
                            <div className={`grid lg:grid-cols-3 border p-4 rounded-2xl gap-8 bg-gradient-to-b ${theme.bg}`}>
                                {/* AQI Section */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="flex items-start gap-8">
                                        <div>
                                            <div className={cn(
                                                `flex items-center gap-2 `,
                                                averages.aqi && (averages.aqi > 200 ? " ring-red-500 animate-pulse" : "")
                                            )}>
                                                <span className="relative flex size-3">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex size-3 rounded-full bg-red-600"></span>
                                                </span>
                                                <span className="text-sm md:text-xl">Live AQI</span>
                                            </div>

                                            <p
                                                style={{ color: theme.color }}
                                                className="text-6xl md:text-8xl font-bold"
                                            >
                                                {typeof averages.aqi === "number" ? Math.round(averages.aqi) : "--"}
                                            </p>
                                        </div>

                                        <div className="px-8 py-3 rounded-2xl flex flex-col items-center">
                                            <p className="text-sm md:text-xl opacity-70">Air Quality</p>
                                            <p
                                                style={{ color: theme.color }}
                                                className="text-lg md:text-4xl font-bold"
                                            >
                                                {theme.label}
                                            </p>
                                        </div>
                                    </div>

                                    {/* PM Cards */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className={`${theme.card} w-fit rounded-xl p-5`}>
                                            <p className="text-sm md:text-2xl">PM10</p>
                                            <p className="text-2xl md:text-4xl font-bold">
                                                {typeof averages.pm10 === "number" ? `${Math.round(averages.pm10)} µg/m³` : "--"}
                                            </p>
                                        </div>

                                        <div className={`${theme.card} w-fit rounded-xl p-5`}>
                                            <p className="text-sm md:text-3xl">PM2.5</p>
                                            <p className="text-2xl md:text-4xl font-bold">
                                                {typeof averages.pm25 === "number" ? `${Math.round(averages.pm25)} µg/m³` : "--"}
                                            </p>
                                        </div>
                                    </div>

                                    {typeof averages.aqi === "number" && <AQIScale currentValue={averages.aqi} />}
                                </div>

                                {/* Image */}
                                <div className="lg:col-span-1 flex items-center justify-center min-h-[300px] md:min-h-[360px]">
                                    <div className="relative w-full h-full max-w-[360px] rounded-3xl ">

                                        <SparklesCore
                                            className="absolute inset-0"
                                            background="transparent"
                                            minSize={0.6}
                                            maxSize={1.4}
                                            particleDensity={6 * (averages.aqi ? averages.aqi : 1)}
                                            particleColor="#000000"
                                        />

                                        {moodImage && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <Image
                                                    src={moodImage}
                                                    width={150}
                                                    height={150}
                                                    alt="Air quality mood"
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>




                                {/* Weather */}

                                <BackgroundGradient className="rounded-[22px] bg-inherit mx-auto p-4 sm:p-10 dark:bg-zinc-900">
                                    <div className={`${theme.card} rounded-2xl p-6 space-y-6`}>
                                        <div className="flex items-center gap-4">
                                            <Cloud className="h-12 w-12" />
                                            <div>
                                                <p className="text-4xl md:text-7xl font-bold">
                                                    {typeof averages.temperature === "number" ? `${parseFloat(averages.temperature.toString()).toFixed(1)}°C` : "--"}
                                                </p>
                                                <p className="text-sm md:text-xl md:ml-2 opacity-70">Weather</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-lg md:text-2xl">
                                                <span className="flex gap-2 ">
                                                    <Droplets className="h-8 w-8" /> Humidity
                                                </span>
                                                <span>
                                                    {typeof averages.humidity === "number" ? `${Math.round(averages.humidity)}%` : "--"}
                                                </span>
                                            </div>


                                            <div className="flex justify-center">
                                                <div className="flex items-center justify-start mt-4">
                                                    <span className="text-sm text-muted-foreground pr-2">
                                                        Powered by
                                                    </span>
                                                    <div>
                                                        <Image
                                                            src="/assets/a2mation-logo.png"
                                                            width={90}
                                                            height={5}
                                                            alt="Picture of the author"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </BackgroundGradient>


                            </div>
                        </div>

                    </Card>
                </div >
            </div >
            <AirQualityIndexTable />
            {/* <AirPollutionTable /> */}
            <PopularCityCards />
        </>
    )
}



function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
}
