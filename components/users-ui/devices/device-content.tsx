"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Calendar, Tag, Loader2, MapPin, Edit2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function DeviceContent() {
    const router = useRouter();
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // 1. Fetch ALL devices for the user (No params sent to backend)
    const { data: allDevices = [], isLoading } = useQuery({
        queryKey: ["user-devices-list"],
        queryFn: async () => {
            const res = await axios.get("/api/user/device");
            return res.data;
        },
    });

    // 2. Perform Filtering in the Frontend using useMemo for performance
    const filteredDevices = useMemo(() => {
        return allDevices.filter((device: any) => {
            // Check Search Match (Name or Serial)
            const matchesSearch = 
                device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.serialNo?.toLowerCase().includes(searchQuery.toLowerCase());

            // Check Category Match
            const matchesCategory = 
                filter === "all" || 
                device.type?.toLowerCase() === filter.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [allDevices, searchQuery, filter]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search & Global Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or serial number..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="w-4 h-4" /> Filter
                </Button>
            </div>

            {/* Type Tabs with Dynamic Counts */}
            <div className="flex gap-2">
                {["all", "indoor", "outdoor"].map((t) => {
                    const count = t === "all" 
                        ? allDevices.length 
                        : allDevices.filter((d: any) => d.type?.toLowerCase() === t).length;
                    
                    return (
                        <Button
                            key={t}
                            variant={filter === t ? "default" : "outline"}
                            onClick={() => setFilter(t)}
                            size="sm"
                            className="capitalize gap-2"
                        >
                            {t} 
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full border",
                                filter === t ? "bg-primary-foreground text-primary" : "bg-muted"
                            )}>
                                {count}
                            </span>
                        </Button>
                    );
                })}
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">Loading devices...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredDevices.map((device: any, index: number) => (
                        <Card
                            key={device.id}
                            className="p-4 hover:shadow-md transition-all group relative border-l-4"
                            style={{
                                borderLeftColor: device.isActive ? "#10b981" : "#cbd5e1",
                                animationDelay: `${index * 30}ms`
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground">
                                            {device.name || "Unnamed Device"}
                                        </h3>
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            device.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                                        )} />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        SN: {device.serialNo}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={device.status === "ASSIGNED" ? "default" : "secondary"}>
                                        {device.status}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => router.push(`/admin/device/${device.id}`)}
                                    >
                                        <Edit2 className="w-4 h-4 text-primary" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Tag className="w-4 h-4" />
                                    {device.model?.name || "Standard Model"}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {device.assignedAt ? format(new Date(device.assignedAt), "MMM dd, yyyy") : "No date"}
                                </span>

                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {device.loaction || "Location not set"}
                                </span>
                            </div>
                        </Card>
                    ))}

                    {filteredDevices.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No devices match your current filters.</p>
                            <Button 
                                variant="link" 
                                onClick={() => {setFilter("all"); setSearchQuery("");}}
                                className="text-primary mt-2"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}