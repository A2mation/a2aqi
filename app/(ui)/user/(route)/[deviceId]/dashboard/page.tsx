"use client"

import { useEffect, useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { StatsCards } from "@/components/users-ui/dashboard/Stats-cards"
import { WeeklyAqiAnalytics } from "@/components/users-ui/dashboard/Weekly-aqi-analytics"
import { MonthlyInsights } from "@/components/users-ui/dashboard/Monthly-Insights"
import { ProjectList } from "@/components/users-ui/dashboard/Project-list"
import { DeviceManagement } from "@/components/users-ui/dashboard/Device-Mangement"
import { MobileAppCard } from "@/components/users-ui/dashboard/Mobile-app-card"
import { ChartRadar } from "@/components/users-ui/dashboard/ChartRadar"
import { Button } from "@/components/ui/button"
import { useDeviceModal } from "@/hooks/use-device-store"
import { DeviceModal } from "@/components/modals/device-modal"
import { cn } from "@/lib/utils"
import { HourlyAnalysis } from "@/components/users-ui/dashboard/hourly-analysis"
import { Skeleton } from "@/components/ui/skeleton"
import { useExportDrawerStore } from "@/store/use-export-drawer-store"
import { useQuery } from "@tanstack/react-query"
import { http } from "@/lib/http"
import { Device } from "@prisma/client"
import { ExportDrawer } from "@/components/Export-Drawer"


export default function DashboardPage() {
    const deviceModal = useDeviceModal();
    const [isClient, setisClient] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const openDrawer = useExportDrawerStore((s) => s.openDrawer);

    useEffect(() => {
        setisClient(true);
    }, [])

    const {
        data: devices = [],
        isLoading,
    } = useQuery<Device[]>({
        queryKey: ["user-devices"],
        queryFn: async () => {
            const res = await http.get<Device[]>("/api/user/device")
            return res.data
        },
    })

    if (!isClient) {
        return <>
            <div className="flex min-h-screen bg-background">
                <Skeleton className="h-screen" />
            </div>
        </>;
    }

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
                                onClick={() =>
                                    openDrawer({
                                        deviceId: "abc123",
                                        type: "hourly",
                                    })
                                }
                            >
                                Export Report
                            </Button>
                        </>
                    }
                />

                {!isLoading && devices?.length > 0 && (
                    <ExportDrawer devices={devices} />
                )}

                <div className="mt-4 md:mt-5 space-y-4 px-2">
                    <StatsCards />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                            <HourlyAnalysis />
                            <WeeklyAqiAnalytics />
                            <DeviceManagement />
                        </div>

                        <div className="lg:col-span-1 space-y-4">
                            <MonthlyInsights />
                            <ChartRadar />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ProjectList />
                        <MobileAppCard />
                    </div>
                </div>
            </main>
        </div>
    )
}
