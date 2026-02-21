"use client"

import { useState } from "react"
import {
    Sparkles,
    Copy,
    Download,
    RefreshCw,
    Bell,
    FileText,
    Share2,
    ShieldAlert,
} from "lucide-react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContentGeneratorPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const templates = [
        { icon: Bell, title: "AQI Alert Message", description: "Generate AQI warning alerts" },
        { icon: FileText, title: "Air Quality Article", description: "Create AQI blog content" },
        { icon: Share2, title: "AQI Social Post", description: "Generate social media posts" },
        { icon: ShieldAlert, title: "Health Advisory", description: "Write safety recommendations" },
    ]

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className="flex-1 p-3 md:p-4 lg:p-5 lg:ml-64">
                <Header
                    title="AQI Content Generator"
                    description="Generate AQI alerts, air quality reports, and health advisory content for a2aqi.com."
                    actions={
                        <Button className="w-full sm:w-auto h-9 text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Content
                        </Button>
                    }
                />

                <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {templates.map((template, index) => (
                            <Card
                                key={index}
                                className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] bg-card border-border"
                            >
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <template.icon className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{template.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        <Card className="p-4 md:p-6 bg-card border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Input</h2>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="location" className="text-sm font-medium text-foreground">
                                        Location / City
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Delhi, Mumbai, Hyderabad"
                                        className="mt-1.5 bg-background border-border"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="aqi" className="text-sm font-medium text-foreground">
                                        AQI Value
                                    </Label>
                                    <Input
                                        id="aqi"
                                        placeholder="e.g., 165"
                                        className="mt-1.5 bg-background border-border"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="pollutants" className="text-sm font-medium text-foreground">
                                        Main Pollutants
                                    </Label>
                                    <Input
                                        id="pollutants"
                                        placeholder="e.g., PM2.5, PM10, NO2"
                                        className="mt-1.5 bg-background border-border"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tone" className="text-sm font-medium text-foreground">
                                        Content Style / Tone
                                    </Label>
                                    <Input
                                        id="tone"
                                        placeholder="e.g., Informative, Warning, Friendly"
                                        className="mt-1.5 bg-background border-border"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="details" className="text-sm font-medium text-foreground">
                                        Additional Details
                                    </Label>
                                    <Textarea
                                        id="details"
                                        placeholder="Example: Recommend mask usage, outdoor activity restrictions, asthma precautions..."
                                        className="mt-1.5 bg-background border-border min-h-[120px]"
                                    />
                                </div>

                                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate AQI Content
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-4 md:p-6 bg-card border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-foreground">Generated Content</h2>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-muted rounded-lg p-4 min-h-[400px] text-sm text-foreground leading-relaxed">
                                <p className="text-muted-foreground italic">
                                    Your AQI-based content will appear here. Enter location and AQI details, then click
                                    "Generate AQI Content".
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
