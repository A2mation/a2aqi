'use client'

import { useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { SettingsContent } from "@/components/users-ui/settings/settings-content"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className={cn(
                "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                isCollapsed ? "lg:ml-16" : "lg:ml-60",
            )}>
                <Header title="Settings" description="Manage your account preferences and application settings." />

                <div className="mt-6">
                    <SettingsContent />
                </div>
            </main>
        </div>
    )
}
