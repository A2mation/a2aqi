"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MapPin, Activity, Shield, ChevronLeft, ChevronRight, Plus, Search, GitGraph } from "lucide-react"
import { getAQIBgColor, getAQIColor } from "@/helpers/aqi-color-pallet"
import AddDeviceModal from "../modals/monior-add-device-modal"
import Heading from "../ui/Heading"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Updated Interface based on your Prisma Schema + AQI field
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
    aqi: number // Extra field requested
    createdAt: string
}

const initialDevices: Device[] = [
    { id: "65f1a...", name: "Downtown Station", serialNo: "SN-9921-X", isActive: true, type: "OUTDOOR", location: "Central Park", lat: 40.785, lng: -73.968, status: "ACTIVE", aqi: 42, createdAt: "2024-01-10" },
    { id: "65f1b...", name: "Office Lobby", serialNo: "SN-4432-B", isActive: true, type: "INDOOR", location: "HQ Floor 1", lat: 40.758, lng: -73.985, status: "ACTIVE", aqi: 12, createdAt: "2024-02-15" },
    { id: "65f1c...", name: null, serialNo: "SN-1100-Z", isActive: false, type: "OUTDOOR", location: "West Pier", lat: 34.019, lng: -118.491, status: "UNASSIGNED", aqi: 85, createdAt: "2024-03-01" },
    { id: "65f1d...", name: "Industrial Zone A", serialNo: "SN-8877-K", isActive: true, type: "OUTDOOR", location: "Factory Road", lat: 41.878, lng: -87.629, status: "MAINTENANCE", aqi: 156, createdAt: "2024-03-05" },
    { id: "65f1e...", name: "Retail Center", serialNo: "SN-2233-L", isActive: true, type: "INDOOR", location: "Mall Entrance", lat: 34.052, lng: -118.243, status: "ACTIVE", aqi: 35, createdAt: "2024-03-10" },
]

const ITEMS_PER_PAGE = 7

export function DeviceList() {
    const router = useRouter();
    const [devices, setDevices] = useState<Device[]>(initialDevices)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")

    // Filter and Search Logic
    const filteredDevices = useMemo(() => {
        return devices.filter(d =>
            d.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        )
    }, [devices, searchQuery])

    // Pagination Logic
    const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedItems = filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE)


    const getStatusBadge = (status: Device["status"]) => {
        const styles = {
            ACTIVE: "bg-blue-100 text-blue-800",
            UNASSIGNED: "bg-gray-100 text-gray-800",
            MAINTENANCE: "bg-orange-100 text-orange-800"
        }
        return <Badge variant="outline" className={`text-[10px] w-fit font-bold ${styles[status]}`}>{status}</Badge>
    }

    return (
        <div className={`min-h-screen flex flex-col bg-background ${isDarkMode ? "dark" : ""}`}>
            {/* Header */}
            <div className="border-b bg-card shrink-0">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <Heading
                                title="Device Management"
                                description="Monitor and configure your sensor network"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 mr-4">
                                <Label htmlFor="dark-mode" className="text-xs text-foreground">{isDarkMode ? `Dark Mode` : 'Light Mode'}</Label>
                                <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                            </div>
                            <Button size="sm" className="gap-2" onClick={() => setIsOpen(true)}>
                                <Plus className="h-4 w-4" /> Register Device
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

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

                <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
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
                                {paginatedItems.map((device) => (
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
                                                    {device.lat?.toFixed(3)}, {device.lng?.toFixed(3)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${getAQIBgColor(device.aqi)} hover:${getAQIBgColor(device.aqi)}/80 text-center font-mono px-3`}>
                                                {device.aqi} AQI
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`inline-flex h-2 w-2 rounded-full ${device.isActive ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                                            <span className="text-xs ml-2 text-muted-foreground">
                                                {device.isActive ? "Online" : "Offline"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 bg-muted/10 border-t">
                        <span className="text-xs text-muted-foreground">
                            Total Devices: <strong>{filteredDevices.length}</strong>
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