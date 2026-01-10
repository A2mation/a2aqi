"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { aqiColorPallet, getAQIColor } from "@/helpers/aqi-color-pallet"

// Sample data - replace with actual API data
const generateAQIData = () => {
    const hours = [
        "02 PM",
        "04 PM",
        "06 PM",
        "08 PM",
        "10 PM",
        "12 AM",
        "02 AM",
        "04 AM",
        "06 AM",
        "08 AM",
        "10 AM",
        "12 PM",
        "02 PM",
    ]

    return hours.map((hour, index) => ({
        time: hour,
        aqi: Math.floor(Math.random() * 100) + 200, // Random AQI between 200-300
    }))
}

const data = [
    { time: "02 PM", aqi: 261 },
    { time: "04 PM", aqi: 500 },
    { time: "06 PM", aqi: 275 },
    { time: "08 PM", aqi: 195 },
    { time: "10 PM", aqi: 295 },
    { time: "12 AM", aqi: 89 },
    { time: "02 AM", aqi: 289 },
    { time: "04 AM", aqi: 123 },
    { time: "06 AM", aqi: 267 },
    { time: "08 AM", aqi: 10 },
    { time: "10 AM", aqi: 243 },
    { time: "12 PM", aqi: 232 },
    { time: "02 PM", aqi: 50 },
]




const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium">{payload[0].payload.time}</p>
                <p className="text-sm text-muted-foreground">
                    AQI: <span className="font-bold text-foreground">{payload[0].value}</span>
                </p>
            </div>
        )
    }
    return null
}

export function AQIGraph() {
    const minAQI = Math.min(...data.map((d) => d.aqi))
    const maxAQI = Math.max(...data.map((d) => d.aqi))
    const minTime = data.find((d) => d.aqi === minAQI)
    const maxTime = data.find((d) => d.aqi === maxAQI)

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">AQI Graph</p>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Historical Air Quality Data</h1>
                        <p className="text-xl text-blue-600 font-medium">Kolkata</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <BarChart3 className="h-4 w-4" fill="true" />
                        </Button>
                        <Select defaultValue="24h">
                            <SelectTrigger className="w-32.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24h">24 Hours</SelectItem>
                                <SelectItem value="7d">7 Days</SelectItem>
                                <SelectItem value="30d">30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="us">
                            <SelectTrigger className="w-32.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">AQI (US)</SelectItem>
                                <SelectItem value="in">AQI (IN)</SelectItem>
                                <SelectItem value="cn">AQI (CN)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 px-1 py-0.5 md:px-4 md:py-2 bg-muted rounded-full">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium">Kolkata</span>
                    </div>
                    <div className="ml-auto flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-8 md:h-12 rounded bg-pink-500 flex items-center justify-center text-white font-bold">
                                {minAQI}
                            </div>
                            <div>
                                <p className="text-xs font-semibold">Min.</p>
                                <p className="text-[10px] text-muted-foreground">at {minTime?.time} on 5th Jan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-8 md:h-12 rounded bg-red-600 flex items-center justify-center text-white font-bold">
                                {maxAQI}
                            </div>
                            <div>
                                <p className="text-xs font-semibold">Max.</p>
                                <p className="text-[10px] text-muted-foreground">at {maxTime?.time} on 4th Jan</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-70 md:h-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />

                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                />

                                <YAxis
                                    domain={[0, 350]}
                                    ticks={[0, 50, 100, 150, 200, 250, 300, 350]}
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                    label={{
                                        value: "AQI (US)",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: { fill: "#6b7280", fontSize: 12 },
                                    }}
                                />

                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />

                                <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getAQIColor(entry.aqi)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>04-01-2026</span>
                    <span>Time</span>
                    <span>05-01-2026</span>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Want air quality data?</p>
                    <Button variant="link" className="text-blue-600">
                        Contact us
                    </Button>
                </div>
            </Card>
        </div>
    )
}
