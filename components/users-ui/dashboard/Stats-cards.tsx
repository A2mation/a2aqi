"use client"

import Image from 'next/image'

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const AirQualityImages: Record<string, string> = {
    Good: "/assets/aqi-moods/Good.png",
    Moderate: "/assets/aqi-moods/Moderate.png",
    Poor: "/assets/aqi-moods/Poor.png",
    Unhealthy: "/assets/aqi-moods/Unhealthy.png",
    Severe: "/assets/aqi-moods/Severe.png",
    Hazardous: "/assets/aqi-moods/Hazard.png",
};

const stats = [
    {
        title: "Air Quality Index",
        value: "180",
        subtitle: "+5% vs last month",
        image: AirQualityImages["Unhealthy"],
    },
    {
        title: "PM2.5 Levels",
        value: "170",
        subtitle: "Across all types",
        image: "/assets/pm2.5-parameter.png"
    },
    {
        title: "PM10 Levels",
        value: "200",
        subtitle: "4 of 6 completed",
        image: "/assets/pm10-perameter.png",
    },
    {
        title: "CO Levels",
        value: "200",
        subtitle: "4 of 6 completed",
        image: "/assets/co-icon.png",
    },
    {
        title: "Temperature",
        value: "20",
        subtitle: "Rating this quarter",
        image: "/assets/temperature.svg"
    },
    {
        title: "Humidity",
        value: "80",
        subtitle: "Rating this quarter",
        image: "/assets/humidity.svg"
    },
    {
        title: "Noise Levels",
        value: "4.5",
        subtitle: "Rating this quarter",
        image: "/assets/noise.svg"
    }
]

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-card border border-border p-4 rounded-lg">
                    <div className='flex flex-row justify-between items-center gap-4'>
                        <div>
                            <Badge variant={"destructive"} className="w-fit text-secondary">Sensor</Badge>
                            <h3 className="text-xl text-muted-foreground font-medium mb-3">{stat.title}</h3>
                            <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                        </div>
                        <div>
                            <Image
                                src={stat.image}
                                width={50}
                                height={50}
                                alt='Icons'
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
