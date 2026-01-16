"use client"

import { useEffect, useState } from "react"
import {
  Heart,
  Share2,
  Cloud,
  Droplets,
  Wind,
  MapPin,
  SquareDashed,
} from "lucide-react"
import dynamic from "next/dynamic"
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
import { detectIpLocation } from "@/store/location.actions"
import { useLocationStore } from "@/store/location.store"
import { Skeleton } from "@/components/ui/skeleton"
import { AQIScale } from "./aqi-scale"
import { cn } from "@/lib/utils"
import { SparklesCore } from "../ui/sparkles"
import { BackgroundGradient } from "../ui/background-gradient"
import { ShareDialog } from "@/components/Share-Button";

const AQIMap = dynamic(() => import("./aqi-map"), { ssr: false })

export function AQIDashboard() {
  const {
    city,
    state,
    country,
    loading,
    lastUpdated,
    temp,
    humidity,
    wind,
    pm10,
    pm25,
    aqi,
    error,
  } = useLocationStore()
  const [open, setOpen] = useState(false);

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
    detectIpLocation()
  }, [])


  useEffect(() => {
    if (typeof aqi === "number") {
      setTheme(getAQITheme(aqi))
    }
  }, [aqi])
  const moodImage = AirQualityImages[theme.label]

  if (loading && !lastUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-10 w-80 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load air quality data.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Map */}
      <div className="relative h-[35vh] bg-muted">
        <AQIMap />
      </div>

      {/* Dashboard */}
      <div className="max-w-[100rem] h-full mx-auto px-4 -mt-32 relative z-10 pb-12">
        <Card className={`overflow-hidden shadow-2xl bg-gradient-to-br ${theme.bg}`}>

          <div className="p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
              <div className="flex gap-y-2 flex-col">
                <h1 className="text-3xl md:text-5xl font-semibold">Real-time Air Quality Index (AQI)</h1>

                <div className={`font-semibold text-sm md:text-2xl underline  ${theme.text}`}>
                  {city || state || country ? (
                    city ? `${city.split(", ").slice(-2).join(", ")}` : `${state},${country}`
                  ) : (
                  <span className="text-muted-foreground">
                    Location unavailable
                  </span>
                  )}
                </div>

                <div className="text-sm md:text-lg text-muted-foreground">
                  {lastUpdated ? `Last updated: ${lastUpdated}` : ""}
                </div>
                <div className="flex items-center justify-start">
                  <span className="text-sm pr-2">
                    Powered by A2mation
                  </span>
                  <div>
                    {/* <Image
                      src="/assets/a2mation-logo.png"
                      width={90}
                      height={5}
                      alt="Picture of the author"
                    /> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Map Button – Primary Action */}
                <a href="/air-quality-map">
                  <Button
                    size="lg"
                    className="gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 
                 text-white shadow-md transition-all duration-300
                 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <MapPin className="h-5 w-5" />
                    View Map
                  </Button>
                </a>

                {/* Favorite Button */}
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 rounded-xl border-blue-300 
               transition-all duration-300
               hover:bg-pink-50 hover:text-pink-600
               hover:scale-110 hover:shadow-md"
                >
                  <Heart className="h-5 w-5" />
                </Button> */}

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
            <div className="grid lg:grid-cols-3 gap-8">
              {/* AQI Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-start gap-8">
                  <div>
                    <div className={cn(
                      `flex items-center gap-2 `,
                      aqi && (aqi > 200 ? " ring-red-500 animate-pulse" : "")
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
                      {typeof aqi === "number" ? aqi : "--"}
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
                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm md:text-2xl">PM10</p>
                    <p className="text-2xl md:text-4xl font-bold">
                      {typeof pm10 === "number" ? `${pm10} µg/m³` : "--"}
                    </p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm md:text-3xl">PM2.5</p>
                    <p className="text-2xl md:text-4xl font-bold">
                      {typeof pm25 === "number" ? `${pm25} µg/m³` : "--"}
                    </p>
                  </div>
                </div>

                {typeof aqi === "number" && <AQIScale currentValue={aqi} />}
              </div>

              {/* Image */}
              <div className="lg:col-span-1 flex items-center justify-center min-h-[300px] md:min-h-[360px]">
                <div className="relative w-full h-full max-w-[360px] rounded-3xl overflow-hidden">

                  <SparklesCore
                    className="absolute inset-0"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={900}
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
                        {typeof temp === "number" ? `${parseFloat(temp.toString()).toFixed(1)}°C` : "--"}
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
                        {typeof humidity === "number" ? `${Math.round(humidity)}%` : "--"}
                      </span>
                    </div>

                    <div className="flex justify-between text-lg md:text-2xl">
                      <span className="flex gap-2">
                        <Wind className="h-8 w-8 items-center" /> Wind
                      </span>
                      <span>
                        {typeof wind === "number" ? `${parseFloat(wind.toString()).toFixed(2)} km/h` : "--"}
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
  )
}
