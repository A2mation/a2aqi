'use client'

import { useEffect } from "react"
import { useDeviceModal } from "@/hooks/use-device-store"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function ClientUserPage() {
    const isOpen = useDeviceModal((state) => state.isOpen)
    const onOpen = useDeviceModal((state) => state.onOpen)

    useEffect(() => {
        onOpen()
    }, [isOpen, onOpen])

    return (
        <>
            <div className="flex min-h-screen bg-background">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:block">
                    <div
                        className={cn(
                            "h-screen border-r bg-card p-4 space-y-4 transition-all duration-300",
                            "w-60"
                        )}
                    >
                        <Skeleton className="h-8 w-32" />
                        <div className="space-y-3 mt-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-md" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300",
                        "lg:ml-60"
                    )}
                >
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-72" />
                        </div>

                        <div className="flex gap-3">
                            <Skeleton className="h-9 w-32 rounded-lg" />
                            <Skeleton className="h-9 w-32 rounded-lg" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-28 w-full rounded-xl" />
                            ))}
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Side */}
                            <div className="lg:col-span-2 space-y-4">
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-64 w-full rounded-xl" />
                            </div>

                            {/* Right Side */}
                            <div className="space-y-4">
                                <Skeleton className="h-52 w-full rounded-xl" />
                                <Skeleton className="h-52 w-full rounded-xl" />
                            </div>
                        </div>

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-48 w-full rounded-xl" />
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}