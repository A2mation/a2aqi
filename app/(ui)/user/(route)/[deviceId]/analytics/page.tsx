'use client'

import { useState } from "react"
import { useParams } from "next/navigation" // Added this

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { AnalyticsContent } from "@/components/users-ui/analytics/analytics-content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExportDrawer } from "@/components/Export-Drawer"
import { useExportDrawerStore } from "@/store/use-export-drawer-store"
import { useDeviceStore } from "@/store/use-device.store"
import { SubscriptionModal } from "@/components/modals/subscription-alert-modal"
import { useSubscription } from "@/hooks/use-subscription"

export default function AnalyticsPage() {
    const { deviceId } = useParams(); 
    const [isCollapsed, setIsCollapsed] = useState(false);

    const openDrawer = useExportDrawerStore((s) => s.openDrawer);

    const { devices } = useDeviceStore();

    const { isLocked, isLoading } = useSubscription(deviceId);


    return (
        <>

            <div className={cn(
                "flex min-h-screen bg-background transition-all duration-500",
                isLocked && "blur-xl pointer-events-none select-none brightness-75")}
            >
                <SubscriptionModal
                    isOpen={!!isLocked}
                    onClose={() => { }}
                />
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
                                disabled={isLocked}
                                className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
                                onClick={() =>
                                    openDrawer({
                                        deviceId: deviceId as string,
                                        type: "hourly",
                                    })
                                }
                            >
                                Export Report
                            </Button>
                        }
                    />

                    {devices?.length > 0 && (
                        <ExportDrawer devices={devices} />
                    )}

                    <div className="mt-6">
                        <AnalyticsContent />
                    </div>
                </main>
            </div>
        </>
    )
}