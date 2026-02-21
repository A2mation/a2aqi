"use client"

import { Plus, MapPin } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import { useDeviceModal } from "@/hooks/use-device-store"
import { http } from "@/lib/http"

export function DeviceManagement() {
    const router = useRouter();
    const deviceModal = useDeviceModal()


    const { data: devices, isLoading } = useQuery({
        queryKey: ["user-devices"],
        queryFn: async () => {
            const { data } = await http.get("/api/user/device")
            return data
        },
    })

    return (
        <Card
            className="p-6 h-80 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
            style={{ animationDelay: "600ms" }}
        >
            <div className="flex items-start gap-4 lg:items-center justify-start lg:justify-between flex-col lg:flex-row mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                    Device Management
                </h2>

                <Button
                    onClick={deviceModal.onOpen}
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300 hover:scale-105 bg-transparent cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New Device
                </Button>
            </div>

            <div className="space-y-4 overflow-y-scroll">
                {/* Loading State */}
                {isLoading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}

                {/* Data State */}
                {!isLoading &&
                    devices?.map((device: any, index: number) => (
                        <Button
                            key={device.id}
                            variant="ghost"
                            onClick={() => router.push(`/user/${device.id}/dashboard`)}
                            className="w-full justify-start h-auto p-0 hover:bg-secondary transition-all duration-300 group cursor-pointer"
                            style={{ animationDelay: `${650 + index * 100}ms` }}
                        >
                            <div className="flex items-center gap-4 p-3 w-full rounded-lg">
                                <Avatar className="w-12 h-12 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-110">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {device.name?.[0]?.toUpperCase() || "D"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 text-left">
                                    <p className="font-semibold text-foreground text-sm">
                                        {device.name || "Unnamed Device"}
                                    </p>

                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                        <MapPin size={12} />
                                        <span className="font-medium">
                                            {device.lat && device.lng
                                                ? `${device.lat}, ${device.lng}`
                                                : "No location"}
                                        </span>
                                    </p>
                                </div>

                                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-300 group-hover:scale-105 whitespace-nowrap">
                                    Active
                                </span>
                            </div>
                        </Button>
                    ))}

                {/* Empty State */}
                {!isLoading && devices?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No devices registered yet.
                    </p>
                )}
            </div>
        </Card>
    )
}