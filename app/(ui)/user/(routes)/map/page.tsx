'use client'

import { useState } from "react"
import dynamic from "next/dynamic";

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"


const MapContent = dynamic(() => import("@/components/users-ui/map/map-content"), { ssr: false })

export default function MapPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className="flex-1 p-4 lg:p-6 lg:ml-64">
                <Header
                    title="A2AQI Maps"
                    description="Tackle your air quality challenges with our interactive maps, providing real-time insights and visualizations to help you make informed decisions."

                />

                <div
                    className="mt-6 relative w-full bg-muted border rounded-lg "
                    style={{
                        height: "70vh"
                    }}
                >
                    <MapContent />
                </div>
            </main>
        </div>
    )
}
