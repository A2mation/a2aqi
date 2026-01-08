'use client'

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, CloudFog, Droplets, Wind, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAQIBorderClass } from "@/helpers/aqi-color-pallet"
import { useLocationStore } from "@/store/location.store"
import { Skeleton } from "../ui/skeleton"
import { useEffect, useMemo } from "react"
import { detectIpLocation } from "@/store/location.actions"

interface Pollutant {
  name: string
  formula: string
  value: number | null
  unit: string
  icon: React.ReactNode
  hasAlert?: boolean
}

export default function AirQualityDashboard() {
  const {
    pm10,
    pm25,
    so2,
    o3,
    co,
    no2,
    loading,
    error
  } = useLocationStore()

  // useEffect(() => {
  //   if (
  //     (!pm10 ||
  //     !pm25 ||
  //     !so2 ||
  //     !o3 ||
  //     !co ||
  //     !no2) && !loading
  //   ) {
  //     detectIpLocation();
  //   }
  // }, [])

  const pollutants: Pollutant[] = useMemo(() => [
    {
      name: "Particulate Matter",
      formula: "(PM2.5)",
      value: pm25 ?? null,
      unit: "µg/m³",
      icon: <CloudFog className="w-10 h-10 text-muted-foreground" />,
    },
    {
      name: "Particulate Matter",
      formula: "(PM10)",
      value: pm10 ?? null,
      unit: "µg/m³",
      icon: <CloudFog className="w-10 h-10 text-muted-foreground" />,
      hasAlert: typeof pm10 === "number" && pm10 > 150,
    },
    {
      name: "Carbon Monoxide",
      formula: "(CO)",
      value: co ?? null,
      unit: "ppb",
      icon: (
        <svg
          className="w-10 h-10 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <ellipse cx="8" cy="12" rx="6" ry="8" />
          <path d="M14 8c2.5 0 4.5 1.8 4.5 4s-2 4-4.5 4" />
        </svg>
      ),
    },
    {
      name: "Sulfur Dioxide",
      formula: "(SO2)",
      value: so2 ?? null,
      unit: "ppb",
      icon: <Droplets className="w-10 h-10 text-muted-foreground" />,
    },
    {
      name: "Nitrogen Dioxide",
      formula: "(NO2)",
      value: no2 ?? null,
      unit: "ppb",
      icon: <Wind className="w-10 h-10 text-muted-foreground" />,
    },
    {
      name: "Ozone",
      formula: "(O3)",
      value: o3 ?? null,
      unit: "ppb",
      icon: <Zap className="w-10 h-10 text-muted-foreground" />,
    },
  ], [pm10, pm25, so2, o3, co, no2])


  if (error) {
    return (
      <div className="min-h-full bg-background p-6 flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          Failed to load air quality data. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">
              Major Air Pollutants
            </h1>
            <p className="text-lg text-blue-600 font-medium">Kolkata</p>
          </div>
          <Button variant="outline" className="border-blue-500 text-blue-600 bg-transparent">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
            Get AQI App
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <Card
              key={index}
              className={cn(
                "relative border-l-4 bg-card hover:shadow-md transition-shadow cursor-pointer",
                pollutant.value !== null ? getAQIBorderClass(pollutant.value) : "border-gray-300"
              )}
            >
              {pollutant.hasAlert && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{pollutant.icon}</div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      {pollutant.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pollutant.formula}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {pollutant.value ?? "--"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pollutant.unit}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
