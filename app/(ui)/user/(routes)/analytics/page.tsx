'use client'

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { AnalyticsContent } from "@/components/users-ui/analytics/analytics-content"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function AnalyticsPage() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className="flex-1 p-4 lg:p-6 lg:ml-64">
                <Header
                    title="Analytics"
                    description="Track your performance and productivity metrics."
                    actions={
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
                        >
                            Export Report
                        </Button>
                    }
                />

                <div className="mt-6">
                    <AnalyticsContent />
                </div>
            </main>
        </div>
    )
}
