"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Thermometer, CheckCircle, Target, ArrowUpRight, Wind } from "lucide-react"
import { useState } from "react"
import { ChartAreaInteractive } from "./chart-analytics"

const stats = [
    { title: "PM2.5", value: "247", change: "+12%", trend: "up", icon: CheckCircle },
    { title: "PM10", value: "12", change: "+3", trend: "up", icon: Target },
    { title: "TEMPERATURE", value: "24", change: "-2", trend: "down", icon: Thermometer },
    { title: "Avg. AQI", value: "230", change: "-0.5", trend: "up", icon: Wind },
]

const monthlyData = [
    { month: "Jan", tasks: 45, projects: 8 },
    { month: "Feb", tasks: 52, projects: 9 },
    { month: "Mar", tasks: 48, projects: 10 },
    { month: "Apr", tasks: 61, projects: 11 },
    { month: "May", tasks: 55, projects: 12 },
    { month: "Jun", tasks: 67, projects: 12 },
]

export function AnalyticsContent() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const maxTasks = Math.max(...monthlyData.map((d) => d.tasks))

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`bg-card text-foreground p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${hoveredCard === index ? "scale-105 shadow-2xl" : "shadow-lg"
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <stat.icon className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-base font-medium opacity-90">{stat.title}</h3>
                            </div>
                            <div
                                className={`w-6 h-6 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 ${hoveredCard === index ? "rotate-45" : ""
                                    }`}
                            >
                                <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold mb-2">
                            {stat.value}
                            {/* {stat.subtitle && <span className="text-base font-normal ml-1">{stat.subtitle}</span>} */}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs opacity-80">
                            {stat.trend === "up" ? (
                                <TrendingUp className="w-3 h-3 text-green-600" />
                            ) : (
                                <TrendingDown className="w-3 h-3 text-red-600" />
                            )}
                            <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <ChartAreaInteractive />
            </div>
        </div>
    )
}
