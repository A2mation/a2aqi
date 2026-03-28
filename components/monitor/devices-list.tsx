"use client"

import Link from "next/link"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { MapPin, Activity, Shield, ChevronLeft, ChevronRight, Search, GitGraph } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAQIBgColor } from "@/helpers/aqi-color-pallet"
import AddDeviceModal from "../modals/monior-add-device-modal"
import Header from "./Header"

interface Device {
    id: string
    name: string | null
    serialNo: string
    isActive: boolean
    type: "OUTDOOR" | "INDOOR"
    location: string | null
    lat: number | null
    lng: number | null
    status: "UNASSIGNED" | "ACTIVE" | "MAINTENANCE"
    aqi: number
    createdAt: string,
    totalCount: string
}

interface DevicesResponse {
    devices: Device[];
    totalCount: number;
}

const ITEMS_PER_PAGE = 7

export function DeviceList() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")

    const { data, isLoading, isPlaceholderData } = useQuery<DevicesResponse>({
        queryKey: ["devices", searchQuery, currentPage],
        queryFn: async () => {
            const response = await http.get(`/api/monitor`, {
                params: {
                    search: searchQuery,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                },
            });
            return response.data;
        },
        placeholderData: (previousData) => previousData,
        staleTime: 120000 // 2 mins
    });


    const paginatedItems = data?.devices || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);


    const getStatusBadge = (status: Device["status"]) => {
        const styles = {
            ACTIVE: "bg-blue-100 text-blue-800",
            UNASSIGNED: "bg-gray-100 text-gray-800",
            MAINTENANCE: "bg-orange-100 text-orange-800"
        }
        return <Badge variant="outline" className={`text-[10px] w-fit font-bold ${styles[status]}`}>{status}</Badge>
    }

    return (
        <div className={cn(
            "min-h-screen flex flex-col bg-background",
            isDarkMode && "dark",
        )}>
            {/* Header */}
            <Header
                setIsOpen={setIsOpen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />

            <AddDeviceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                loading={false}
            />

            {/* Main Content */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search serial no or name..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Link
                        href={'/monitor/analytics'}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                    >
                        <GitGraph size={16} /> Advanced Analysis
                    </Link>

                </div>

                <div className={cn(
                    "border rounded-xl bg-card overflow-hidden shadow-sm",
                    isPlaceholderData ? "opacity-50 pointer-events-none" : "opacity-100"
                )}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <th className="px-6 py-4">Device Info</th>
                                    <th className="px-6 py-4">Type / Status</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">AQI Level</th>
                                    <th className="px-6 py-4 text-right">Connectivity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {isLoading || isPlaceholderData ?
                                    <TableSkeleton /> :
                                    paginatedItems.length !== 0 ?
                                        (paginatedItems.map((device) => (
                                            <tr
                                                key={device.id}
                                                className="hover:bg-muted/20 cursor-pointer transition-colors"
                                                onClick={() => router.push(`/monitor/device/${device.id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-foreground">{device.name || "Unnamed Device"}</span>
                                                        <span className="text-xs text-muted-foreground font-mono">{device.serialNo}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-1.5 text-[11px] font-medium">
                                                            {device.type === "OUTDOOR" ? <Shield className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                                                            {device.type}
                                                        </div>
                                                        {getStatusBadge(device.status)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                                            {device.location || "Not Set"}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground ml-4">
                                                            {device.lat?.toFixed(2)}, {device.lng?.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`${getAQIBgColor(Math.round(device.aqi))} hover:${getAQIBgColor(device.aqi)}/80 text-center font-mono px-3`}>
                                                        {Math.round(device.aqi)} AQI
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`inline-flex h-2 w-2 rounded-full ${device.isActive ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                                                    <span className="text-xs ml-2 text-muted-foreground">
                                                        {device.isActive ? "Online" : "Offline"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))) : (<tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                                No devices found matching your search.
                                            </td>
                                        </tr>)
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t">
                        <span className="text-xs text-muted-foreground">
                            Total Devices: <strong>{data?.totalCount}</strong>
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium">Page {currentPage} of {totalPages}</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const TableSkeleton = () => (
    <>
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <tr key={i} className="border-b animate-pulse">
                <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-muted rounded mb-2" />
                    <div className="h-3 w-20 bg-muted/60 rounded" />
                </td>
                <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-muted rounded mb-2" />
                    <div className="h-4 w-20 bg-muted/60 rounded" />
                </td>
                <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-muted rounded mb-2" />
                    <div className="h-3 w-16 bg-muted/60 rounded" />
                </td>
                <td className="px-6 py-4">
                    <div className="h-8 w-20 bg-muted rounded-full" />
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="inline-block h-4 w-12 bg-muted rounded" />
                </td>
            </tr>
        ))}
    </>
);