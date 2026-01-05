"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getAQIColor } from "@/helpers/aqi-color-pallet"

type Location = {
    name: string
    status: "Severe" | "Unhealthy"
    aqi: number
    pm25: number
    pm10: number
    temp: number
    humidity: number
}

const locations: Location[] = [
    { name: "6ms", status: "Severe", aqi: 204, pm25: 129, pm10: 174, temp: 20.1, humidity: 57 },
    { name: "Government Colony", status: "Severe", aqi: 233, pm25: 158, pm10: 207, temp: 20.3, humidity: 54 },
    { name: "Manicktala", status: "Severe", aqi: 213, pm25: 138, pm10: 179, temp: 17, humidity: 68 },
    { name: "Paschim Putiary", status: "Severe", aqi: 230, pm25: 155, pm10: 207, temp: 18, humidity: 64 },
    { name: "Rabindrapally", status: "Severe", aqi: 218, pm25: 143, pm10: 183, temp: 19.1, humidity: 57 },
    { name: "Ballygunge", status: "Unhealthy", aqi: 196, pm25: 119, pm10: 164, temp: 18, humidity: 64 },
    { name: "Banerjee Para", status: "Unhealthy", aqi: 191, pm25: 113, pm10: 149, temp: 19.7, humidity: 56 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },
    { name: "Bidhannagar", status: "Unhealthy", aqi: 192, pm25: 114, pm10: 143, temp: 18, humidity: 64 },

]

type SortKey = keyof Location | null
type SortOrder = "asc" | "desc"

export function AirPollutionTable() {
    const [sortKey, setSortKey] = useState<SortKey>(null)
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

    const handleSort = (key: keyof Location) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortKey(key)
            setSortOrder("asc")
        }
    }

    const sortedLocations = [...locations].sort((a, b) => {
        if (!sortKey) return 0

        const aVal = a[sortKey]
        const bVal = b[sortKey]

        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "asc" ? aVal - bVal : bVal - aVal
        }

        return 0
    })

    const SortIcon = ({ column }: { column: keyof Location }) => {
        if (sortKey !== column) return null
        return sortOrder === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        )
    }

    return (
        <section className="min-h-xl bg-background p-5 md:p-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="space-y-6">
                    <div className="space-y-1 border-b-2 pb-4">
                        <h1 className="text-3xl font-bold text-balance">
                            {"Kolkata's Locations"}
                        </h1>
                        <p className="text-lg text-blue-500">Real-time Air Pollution Level</p>
                    </div>

                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="max-h-120 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-card z-10">
                                        <tr className="border-b border-border">
                                            <th onClick={() => handleSort("name")} className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer">
                                                Location <SortIcon column="name" />
                                            </th>
                                            <th onClick={() => handleSort("status")} className="px-6 py-4 text-left text-sm font-medium text-muted-foreground cursor-pointer">
                                                Status <SortIcon column="status" />
                                            </th>
                                            <th onClick={() => handleSort("aqi")} className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer">
                                                AQI (US) <SortIcon column="aqi" />
                                            </th>
                                            <th onClick={() => handleSort("pm25")} className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer">
                                                PM2.5<br /><span className="text-xs">(µg/m³)</span>
                                                <SortIcon column="pm25" />
                                            </th>
                                            <th onClick={() => handleSort("pm10")} className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer">
                                                PM10<br /><span className="text-xs">(µg/m³)</span>
                                                <SortIcon column="pm10" />
                                            </th>
                                            <th onClick={() => handleSort("temp")} className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer">
                                                Temp.<br /><span className="text-xs">(°C)</span>
                                                <SortIcon column="temp" />
                                            </th>
                                            <th onClick={() => handleSort("humidity")} className="px-6 py-4 text-center text-sm font-medium text-muted-foreground cursor-pointer">
                                                Humi.<br /><span className="text-xs">(%)</span>
                                                <SortIcon column="humidity" />
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sortedLocations.map((location, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium">{location.name}</td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        style={{ backgroundColor: getAQIColor(location.aqi) }}
                                                        className="text-white "
                                                    >
                                                        {location.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-center">{location.aqi}</td>
                                                <td className="px-6 py-4 text-center">{location.pm25}</td>
                                                <td className="px-6 py-4 text-center">{location.pm10}</td>
                                                <td className="px-6 py-4 text-center">{location.temp}</td>
                                                <td className="px-6 py-4 text-center">{location.humidity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
