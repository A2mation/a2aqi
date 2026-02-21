"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import ChartLoader from "@/components/ui/chart-loading"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ExportItem {
    id: string
    fileName: string
    format: "CSV" | "PDF" | "EXCEL"
    deviceName: string
    dateRange: string
    createdAt: string
    status: "COMPLETED" | "PROCESSING" | "FAILED"
}

const ExportHistory = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const { data: exports, isLoading } = useQuery({
        queryKey: ["export-history"],
        queryFn: async () => {
            await new Promise((res) => setTimeout(res, 1000))

            return [
                {
                    id: "1",
                    fileName: "aqi-report-jan.csv",
                    format: "CSV",
                    deviceName: "Living Room Sensor",
                    dateRange: "Jan 1 - Jan 31",
                    createdAt: new Date().toISOString(),
                    status: "COMPLETED",
                },
                {
                    id: "2",
                    fileName: "aqi-report-feb.pdf",
                    format: "PDF",
                    deviceName: "Outdoor Sensor",
                    dateRange: "Feb 1 - Feb 15",
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    status: "PROCESSING",
                },
                {
                    id: "3",
                    fileName: "temperature-data.xlsx",
                    format: "EXCEL",
                    deviceName: "Warehouse Monitor",
                    dateRange: "Mar 1 - Mar 10",
                    createdAt: new Date(Date.now() - 7200000).toISOString(),
                    status: "FAILED",
                },
            ] as ExportItem[]
        },
    })

    return (
        <section>
            <div className="flex min-h-screen bg-white">
                {/* SIDEBAR */}
                <div className="hidden lg:block">
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>

                {/* MAIN CONTENT */}
                <div
                    className={cn(
                        "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                        isCollapsed ? "lg:ml-16" : "lg:ml-60"
                    )}
                >
                    <Header
                        title="Export History"
                        description="Download and manage your exported device data."
                    />

                    <div className="mt-20 md:mt-5 space-y-6 px-2 max-w-7xl mx-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-screen">
                                <ChartLoader />
                            </div>
                        ) : exports?.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                No export history available.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {exports?.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="hover:shadow-md transition"
                                    >
                                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                            {/* LEFT SIDE */}
                                            <div className="space-y-1">
                                                <h3 className="font-semibold">
                                                    {item.fileName}
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    Device: {item.deviceName}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    Date Range: {item.dateRange}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* RIGHT SIDE */}
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={
                                                        item.status === "COMPLETED"
                                                            ? "default"
                                                            : item.status === "FAILED"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>

                                                {item.status === "COMPLETED" && (
                                                    <Button size="sm">
                                                        Download
                                                    </Button>
                                                )}
                                            </div>

                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExportHistory