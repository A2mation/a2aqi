'use client'

import { useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { DeviceModal } from "@/components/modals/device-modal"
import { cn } from "@/lib/utils"
import EditDeviceContent from "@/components/users-ui/edit/EditDeviceContent"

export default function EditPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-background">
            <DeviceModal />
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>
            <main className={cn(
                "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                isCollapsed ? "lg:ml-16" : "lg:ml-60",
            )}>
                <Header
                    title="Edit Devices"
                    description="Manage your devices efficiently."
                    
                />

                <div className="mt-2">
                    <EditDeviceContent/>
                </div>
            </main>
        </div>
    )
}
