"use client"

import { useState } from "react"
import { Search, Filter, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const devices = [
    {
        id: 1,
        title: "Indoor AQI Sensor - Living Room",
        name: "Air Monitor Pro",
        priority: "High",
        date: "Nov 24, 2024",
        deviceType: "Indoor",
        tags: ["PM2.5", "CO2"],
    },
    {
        id: 2,
        title: "Outdoor AQI Sensor - Backyard",
        name: "Air Monitor Outdoor",
        priority: "High",
        date: "Nov 25, 2024",
        deviceType: "Outdoor",
        tags: ["PM10", "Weather"],
    },
    {
        id: 3,
        title: "Indoor AQI Sensor - Office",
        name: "Smart Air Sense",
        priority: "Medium",
        date: "Nov 23, 2024",
        deviceType: "Indoor",
        tags: ["Humidity", "Temperature"],
    },
    {
        id: 4,
        title: "Outdoor AQI Sensor - Street Side",
        name: "Urban Air Tracker",
        priority: "Low",
        date: "Nov 26, 2024",
        deviceType: "Outdoor",
        tags: ["Pollution", "Dust"],
    },
    {
        id: 5,
        title: "Indoor AQI Sensor - Bedroom",
        name: "Home Air Sensor",
        priority: "High",
        date: "Nov 24, 2024",
        deviceType: "Indoor",
        tags: ["CO2", "VOC"],
    },
    {
        id: 6,
        title: "Outdoor AQI Sensor - Roof",
        name: "Sky Air Monitor",
        priority: "Medium",
        date: "Nov 27, 2024",
        deviceType: "Outdoor",
        tags: ["PM2.5", "Wind"],
    },
]

export function DeviceContent() {
    const [filter, setFilter] = useState("all")

    const filteredDevices =
        filter === "all"
            ? devices
            : devices.filter((d) => d.deviceType.toLowerCase() === filter)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search + Filter Buttons */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search devices..." className="pl-10" />
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                    size="sm"
                >
                    All ({devices.length})
                </Button>

                <Button
                    variant={filter === "indoor" ? "default" : "outline"}
                    onClick={() => setFilter("indoor")}
                    size="sm"
                >
                    Indoor ({devices.filter((d) => d.deviceType === "Indoor").length})
                </Button>

                <Button
                    variant={filter === "outdoor" ? "default" : "outline"}
                    onClick={() => setFilter("outdoor")}
                    size="sm"
                >
                    Outdoor ({devices.filter((d) => d.deviceType === "Outdoor").length})
                </Button>
            </div>

            {/* Device Cards */}
            <div className="grid gap-4">
                {filteredDevices.map((device, index) => (
                    <Card
                        key={device.id}
                        className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-semibold text-foreground">{device.title}</h3>

                                <Badge
                                    variant={
                                        device.priority === "High"
                                            ? "destructive"
                                            : device.priority === "Medium"
                                                ? "default"
                                                : "secondary"
                                    }
                                    className="shrink-0"
                                >
                                    {device.priority}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    {device.name}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {device.date}
                                </span>

                                <Badge variant="outline" className="text-xs">
                                    {device.deviceType}
                                </Badge>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {device.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
