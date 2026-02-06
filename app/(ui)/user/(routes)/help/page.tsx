'use client'

import { useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { HelpContent } from "@/components/users-ui/help/help-content"
import { cn } from "@/lib/utils"

export default function HelpPage() {
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
                <Header title="Help & Support" description="Get help with using Tasko and find answers to common questions." />

                <div className="mt-6">
                    <HelpContent />
                </div>
            </main>
        </div>
    )
}
