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

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AQITheme, getAQITheme } from "@/helpers/aqi-color-pallet"
import { detectIpLocation } from "@/store/location.actions"
import { useLocationStore } from "@/store/location.store"
import { Skeleton } from "@/components/ui/skeleton"
import { AQIScale } from "./aqi-scale"
import { cn } from "@/lib/utils"

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

  const [theme, setTheme] = useState<AQITheme>({
    label: "Unknown",
    color: "#9CA3AF",
    borderClass: "border-gray-200 dark:border-gray-800",
    bg: "from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900",
    text: "text-gray-700 dark:text-gray-300",
    card: "bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md",

  })


  useEffect(() => {
    detectIpLocation()
  }, [])


  useEffect(() => {
    if (typeof aqi === "number") {
      setTheme(getAQITheme(aqi))
    }
  }, [aqi])

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
      <div className="relative h-[40vh] bg-muted">
        <AQIMap />
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl min-w-[85vw] mx-auto px-4 -mt-32 relative z-10 pb-12">
        <Card className={`overflow-hidden shadow-2xl bg-gradient-to-br ${theme.bg}`}>
          <div className="p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Real-time AQI</h1>

                <div className={`font-semibold ${theme.text}`}>
                  {city || state || country ? (
                    `${city ?? ""}${city && state ? ", " : ""}${state ?? ""}${(city || state) && country ? ", " : ""}${country ?? ""}`
                  ) : (
                    <span className="text-muted-foreground">
                      Location unavailable
                    </span>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {lastUpdated ? `Last updated: ${lastUpdated}` : ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  Powered by A2mation Solution
                </div>
              </div>

              <div className="flex gap-2">
                <a href="/air-quality-map">
                  <Button variant="outline" className="gap-2 hover:cursor-pointer" >
                    <MapPin className="h-4 w-4" /> View in Maps
                  </Button>
                </a>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* AQI Section */}
              <div className="lg:col-span-2 space-y-6">
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
                      <span className="text-sm">Live AQI</span>
                    </div>

                    <p
                      style={{ color: theme.color }}
                      className="text-6xl md:text-8xl font-bold"
                    >
                      {typeof aqi === "number" ? aqi : "--"}
                    </p>
                  </div>

                  <div className="px-8 py-3 rounded-2xl flex flex-col items-center">
                    <p className="text-sm opacity-70">Air Quality</p>
                    <p
                      style={{ color: theme.color }}
                      className="text-lg md:text-3xl font-bold"
                    >
                      {theme.label}
                    </p>
                  </div>
                </div>

                {/* PM Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm">PM10</p>
                    <p className="text-2xl font-bold">
                      {typeof pm10 === "number" ? `${pm10} µg/m³` : "--"}
                    </p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm">PM2.5</p>
                    <p className="text-2xl font-bold">
                      {typeof pm25 === "number" ? `${pm25} µg/m³` : "--"}
                    </p>
                  </div>
                </div>

                {typeof aqi === "number" && <AQIScale currentValue={aqi} />}
              </div>

              {/* Weather */}
              <div className={`${theme.card} rounded-2xl p-6 space-y-6`}>
                <div className="flex items-center gap-4">
                  <Cloud className="h-10 w-10" />
                  <div>
                    <p className="text-4xl font-bold">
                      {typeof temp === "number" ? `${temp}°C` : "--"}
                    </p>
                    <p className="text-sm opacity-70">Weather</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex gap-2">
                      <Droplets className="h-4 w-4" /> Humidity
                    </span>
                    <span>
                      {typeof humidity === "number" ? `${Math.round(humidity)}%` : "--"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex gap-2">
                      <Wind className="h-4 w-4" /> Wind
                    </span>
                    <span>
                      {typeof wind === "number" ? `${parseFloat(wind.toString()).toFixed(2)} km/h` : "--"}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span className="text-sm text-muted-foreground" >
                      Powered by A2mation Solution
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
