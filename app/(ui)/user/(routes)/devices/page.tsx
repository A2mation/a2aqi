'use client'

import { useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { DeviceContent } from "@/components/users-ui/devices/device-content"
import { Button } from "@/components/ui/button"

export default function TasksPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>
            <main className="flex-1 p-4 lg:p-6 lg:ml-64">
                <Header
                    title="Devices"
                    description="Manage and organize your devices efficiently."
                    actions={
                        <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                            + Add Device
                        </Button>
                    }
                />

                <div className="mt-6">
                    <DeviceContent />
                </div>
            </main>
        </div>
    )
}
