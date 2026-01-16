'use client'

import type React from "react"
import { useMemo } from "react"
import { ChevronRight, CloudFog, Droplets, Wind, Zap } from "lucide-react"
import Image from 'next/image'

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAQIBorderClass } from "@/helpers/aqi-color-pallet"
import { useLocationStore } from "@/store/location.store"
import { getPollutantGradientClass, PollutantType } from "@/helpers/pollutant-color-pallet"

interface Pollutant {
  name: string
  formula: string
  value: number | null
  unit: string
  pollutantType: PollutantType,
  icon: string
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
    city,
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
      pollutantType: "pm25",
      value: pm25 ?? null,
      unit: "µg/m³",
      icon: "/assets/pm2.5-parameter.png",
    },
    {
      name: "Particulate Matter",
      formula: "(PM10)",
      pollutantType: "pm10",
      value: pm10 ?? null,
      unit: "µg/m³",
      icon: "/assets/pm10-perameter.png",
      hasAlert: typeof pm10 === "number" && pm10 > 150,
    },
    {
      name: "Carbon Monoxide",
      formula: "(CO)",
      pollutantType: "co",
      value: co ?? null,
      unit: "ppb",
      icon: "/assets/co-icon.png",
    },
    {
      name: "Sulfur Dioxide",
      formula: "(SO2)",
      pollutantType: "so2",
      value: so2 ?? null,
      unit: "ppb",
      icon: "/assets/so2-icon.png",
    },
    {
      name: "Nitrogen Dioxide",
      formula: "(NO2)",
      value: no2 ?? null,
      pollutantType: "no2",
      unit: "ppb",
      icon: "/assets/no2-icon.png",
    },
    {
      name: "Ozone",
      formula: "(O3)",
      pollutantType: "o3",
      value: o3 ?? null,
      unit: "ppb",
      icon: "/assets/o3.svg",
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
      <div className="max-w-[90rem] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">
              Major Air Pollutants
            </h1>
            <p className="text-lg text-blue-600 font-medium">
              {city && city.split(", ").slice(-2).join(", ")}
            </p>
          </div>

          <div className="flex items-center justify-start mt-4 px-4 py-2 rounded-xl border-2 border-blue-500 text-blue-600 bg-transparent">
            <span className="text-sm text-muted-foreground pr-2">
              Powered by
            </span>
            <div>
              <Image
                src="/assets/a2mation-logo.png"
                width={80}
                height={5}
                alt="Picture of the author"
              />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <Card
              key={index}
              className={cn(
                "relative border-l-4 bg-card hover:shadow-md transition-shadow cursor-pointer",
                pollutant.value !== null ? getAQIBorderClass(pollutant.value) : "border-gray-300",
                "bg-gray-50"
              )}
            >
              {pollutant.hasAlert && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{
                    <Image
                      src={pollutant.icon}
                      width={60}
                      height={80}
                      alt="Picture of the author"
                    />
                  }</div>
                  <div>
                    <div className="text-sm md:text-xl font-medium text-foreground mb-1">
                      {pollutant.name}
                    </div>
                    <div className="text-lg font-semibold">
                      {pollutant.formula}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {pollutant.value ?? "--"}
                    </div>
                    <div className="text-lg font-semibold">
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
