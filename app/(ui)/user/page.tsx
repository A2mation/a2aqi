"use client"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { StatsCards } from "@/components/users-ui/dashboard/Stats-cards"
import { AqiAnalytics } from "@/components/users-ui/dashboard/Aqi-analytics"
import { MonthlyInsights } from "@/components/users-ui/dashboard/Monthly-Insights"
import { ProjectList } from "@/components/users-ui/dashboard/Project-list"
import { DeviceManagement } from "@/components/users-ui/dashboard/Device-Mangement"
// import { ProjectProgress } from "@/components/users-ui/dashboard/Project-progress"
import { MobileAppCard } from "@/components/users-ui/dashboard/Mobile-app-card"
import { TimeTracker } from "@/components/users-ui/dashboard/Time-tracker"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useDeviceModal } from "@/hooks/use-device-store"
import { DeviceModal } from "@/components/modals/device-modal"


export default function DashboardPage() {
    const deviceModal = useDeviceModal();
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main
                className={cn(
                    "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60",
                )}
            >
                <DeviceModal />
                <Header
                    title="A2aqi Dashboard"
                    description="Monitor air quality with accurate, data-driven insights."
                    actions={
                        <>
                            <Button
                                onClick={deviceModal.onOpen}
                                className="w-full hover:cursor-pointer sm:w-auto h-9 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                            >
                                + Add New Device
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full hover:cursor-pointer sm:w-auto h-9 px-4 text-sm font-medium rounded-lg bg-transparent"
                            >
                                Export Report
                            </Button>
                        </>
                    }
                />

                <div className="mt-4 md:mt-5 space-y-4 px-2">
                    <StatsCards />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                            <AqiAnalytics />
                            <DeviceManagement />
                        </div>

                        <div className="space-y-4">
                            <MonthlyInsights />
                            {/* <ProjectProgress /> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ProjectList />
                        <MobileAppCard />
                        <TimeTracker />
                    </div>
                </div>
            </main>
        </div>
    )
}
