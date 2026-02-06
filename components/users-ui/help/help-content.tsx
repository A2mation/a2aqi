"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Search,
    Mail,
    MapPin,
    BellRing,
    Activity,
} from "lucide-react"

const helpCategories = [
    {
        icon: MapPin,
        title: "AQI Map Guide",
        description: "Learn how to use the live AQI map and station markers",
        color: "bg-blue-500",
    },
    {
        icon: Activity,
        title: "AQI & Pollutants",
        description: "Understand PM2.5, PM10, NO2, CO and health impact",
        color: "bg-purple-500",
    },
    {
        icon: BellRing,
        title: "Alerts & Notifications",
        description: "Set AQI alerts for your city and receive updates",
        color: "bg-green-600",
    },
    {
        icon: Mail,
        title: "Contact Support",
        description: "Get help from the a2aqi.com support team",
        color: "bg-amber-500",
    },
]

const faqs = [
    {
        question: "What is AQI and how is it calculated?",
        answer:
            "AQI (Air Quality Index) is a number used to represent air pollution levels. It is calculated using pollutants like PM2.5, PM10, NO2, CO, SO2 and O3.",
    },
    {
        question: "How do I check AQI for my location?",
        answer:
            "Go to the Map page and allow location access, or search your city in the search bar to view real-time AQI levels.",
    },
    {
        question: "What does PM2.5 mean?",
        answer:
            "PM2.5 refers to fine particulate matter smaller than 2.5 microns. It is one of the most harmful pollutants because it can enter deep into the lungs.",
    },
    {
        question: "How can I set AQI alerts?",
        answer:
            "Open the Alerts section and choose your city and AQI threshold. You will receive notifications when air quality becomes unhealthy.",
    },
    {
        question: "Why is AQI different between stations in the same city?",
        answer:
            "AQI can vary based on traffic, industries, wind conditions, and sensor placement. Different monitoring stations may show different readings.",
    },
    {
        question: "Can I export AQI data?",
        answer:
            "Yes. You can export station or city-level AQI reports from the dashboard for analysis and reporting purposes.",
    },
]

export function HelpContent() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredCategories = helpCategories.filter((category) =>
        `${category.title} ${category.description}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    const filteredFaqs = faqs.filter((faq) =>
        `${faq.question} ${faq.answer}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search help articles (AQI, PM2.5, alerts...)"
                    className="pl-10 h-12"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                        <Card
                            key={category.title}
                            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer animate-slide-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${category.color}`}>
                                    <category.icon className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground col-span-2">
                        No help categories found.
                    </p>
                )}
            </div>

            {/* FAQs */}
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Frequently Asked Questions</h3>

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={faq.question}
                                className="p-4 rounded-lg border border-border hover:bg-secondary transition-all duration-300 animate-slide-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <h4 className="font-medium mb-2">{faq.question}</h4>
                                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No FAQs matched your search.
                        </p>
                    )}
                </div>
            </Card>
        </div>
    )
}
