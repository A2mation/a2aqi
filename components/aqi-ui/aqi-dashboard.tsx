"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Heart,
  Share2,
  Cloud,
  Droplets,
  Wind,
  Sun,
} from "lucide-react"
import { AQIMap } from "./aqi-map"
import { AQIScale } from "./aqi-scale"
import { getAQITheme } from "@/helpers/aqi-color-pallet"

interface AQIData {
  value: number
  status: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe" | "Hazardous"
  pm10: number
  pm25: number
  location: string
  lastUpdated: string
  weather: {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
    uvIndex: number
  }
}

/* ---------------- COMPONENT ---------------- */

export function AQIDashboard() {
  const [aqiData] = useState<AQIData>({
    value: 10,
    status: "Severe",
    pm10: 181,
    pm25: 134,
    location: "Kolkata, West Bengal, India",
    lastUpdated: "2026-01-05 12:30",
    weather: {
      temp: 16,
      condition: "Mist",
      humidity: 72,
      windSpeed: 17,
      uvIndex: 5,
    },
  })

  const theme = getAQITheme(aqiData.value)

  return (
    <div className="min-h-screen bg-background">
      {/* Map */}
      <div className="relative h-[40vh] bg-muted">
        <AQIMap />
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-12">
        <Card
          className={`overflow-hidden shadow-2xl bg-gradient-to-br ${theme.bg} `}
        >
          <div className="p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Real-time AQI</h1>
                <p className={`font-semibold ${theme.text}`}>
                  {aqiData.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Updated: {aqiData.lastUpdated}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" /> Locate me
                </Button>
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
              {/* AQI */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-start gap-8">
                  <div>
                    <div className={`flex items-center gap-2 ${aqiData.value > 200 ? " ring-red-500 animate-pulse" : ""
                      }`}>
                      <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-red-600"></span>
                      </span>
                      <span className="text-sm text-red-600">
                        Live AQI
                      </span>
                    </div>
                    <p
                      style={{ color: theme.color }}
                      className={`text-8xl font-bold bg-clip-text text-transparent]`}
                    >
                      {aqiData.value}
                    </p>
                  </div>

                  <div
                    className={`px-8 py-3  rounded-2xl flex flex-col items-center justify-center text-white `}
                  >
                    <p className=" text-black opacity-80 mb-2">Air Quality</p>
                    <p
                      style={{ color: theme.color }}
                      className={`text-3xl px-4 py-2 rounded font-bold `}
                    >{aqiData.status}</p>
                  </div>
                </div>

                {/* PM Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm">PM10</p>
                    <p className="text-2xl font-bold">{aqiData.pm10} µg/m³</p>
                  </div>

                  <div className={`${theme.card} rounded-xl p-5`}>
                    <p className="text-sm">PM2.5</p>
                    <p className="text-2xl font-bold">{aqiData.pm25} µg/m³</p>
                  </div>
                </div>

                <AQIScale currentValue={aqiData.value} />
              </div>

              {/* Weather */}
              <div className={`${theme.card} rounded-2xl p-6 space-y-6 w-75 md:w-full`}>
                <div className="flex items-center gap-4">
                  <Cloud className="h-10 w-10" />
                  <div>
                    <p className="text-4xl font-bold">
                      {aqiData.weather.temp}°C
                    </p>
                    <p>{aqiData.weather.condition}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex gap-2">
                      <Droplets className="h-4 w-4" /> Humidity
                    </span>
                    <span>{aqiData.weather.humidity}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex gap-2">
                      <Wind className="h-4 w-4" /> Wind
                    </span>
                    <span>{aqiData.weather.windSpeed} km/h</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex gap-2">
                      <Sun className="h-4 w-4" /> UV Index
                    </span>
                    <span>{aqiData.weather.uvIndex}</span>
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
