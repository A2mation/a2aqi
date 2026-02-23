'use client'

import { useState } from "react"
import { Device } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { AnalyticsContent } from "@/components/users-ui/analytics/analytics-content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import { ExportDrawer } from "@/components/Export-Drawer"
import { useExportDrawerStore } from "@/store/use-export-drawer-store"

export default function AnalyticsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const openDrawer = useExportDrawerStore((s) => s.openDrawer);

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
    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className={cn(
                "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                isCollapsed ? "lg:ml-16" : "lg:ml-60",
            )}>
                <Header
                    title="Analytics"
                    description="Track your performance and productivity metrics."
                    actions={
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
                            onClick={() =>
                                openDrawer({
                                    deviceId: "abc123",
                                    type: "hourly",
                                })
                            }
                        >
                            Export Report
                        </Button>
                    }
                />

                {!isLoading && devices?.length > 0 && (
                    <ExportDrawer devices={devices} />
                )}


                <div className="mt-6">
                    <AnalyticsContent />
                </div>
            </main>
        </div>
    )
}
