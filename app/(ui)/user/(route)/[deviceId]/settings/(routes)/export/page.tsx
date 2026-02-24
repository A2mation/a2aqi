"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import {
    Calendar,
    Download,
    FileText,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
    HardDrive,
    Loader2
} from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import ChartLoader from "@/components/ui/chart-loading"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatFileSize } from "@/utils/formatFileSize"
import { ExportLog } from "@/types/type"

const ExportHistory = () => {
    const { ref, inView } = useInView()
    const [searchTerm, setSearchTerm] = useState("")
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [statusFilter, setStatusFilter] = useState("ALL")

    // 1. Setup Infinite Query for MongoDB
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
        refetch
    } = useInfiniteQuery({
        queryKey: ["export-history-mongo"],
        queryFn: async ({ pageParam = null }) => {
            const res = await http.get(`/api/user/export?cursor=${pageParam ?? ""}`)
            return res.data // Expected: { items: ExportLog[], nextCursor: string | null }
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    // 2. Trigger load more when scrolling
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

    // 3. Flatten pages into a single array
    const allLogs = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) || []
    }, [data])

    // 4. Handle Search and Filters
    const filteredLogs = useMemo(() => {
        return allLogs.filter((log) => {
            const deviceName = log.device?.name?.toLowerCase() || ""
            const type = (log.metadata as any)?.type?.toLowerCase() || ""

            const matchesSearch = deviceName.includes(searchTerm.toLowerCase()) ||
                type.includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "ALL" || log.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [allLogs, searchTerm, statusFilter])

    const handleDownload = async (log: ExportLog) => {
        try {
            const payload = {
                deviceId: log.deviceId || "",
                startDate: log.fromDate,
                endDate: log.toDate,
                type: log.metadata?.type || "hourly",
            }

            const res = await http.post("/api/user/export", payload, {
                responseType: "blob",
            })

            const blob = new Blob([res.data], { type: "text/csv" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `a2aqi-report-${new Date(log.requestedAt).getTime()}.csv`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed", error)
        }
    }

    return (
        <section className="min-h-screen bg-slate-50/50">
            <div className="flex">
                <div className="hidden lg:block">
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>

                <div className={cn(
                    "flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60"
                )}>
                    <Header
                        title="Export History"
                        description="Access and manage your generated air quality reports."
                    />

                    <div className="mt-8 space-y-6 max-w-6xl mx-auto">

                        {/* SEARCH & FILTERS */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by device name or type..."
                                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-40 bg-white">
                                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Status</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="PROCESSING">Processing</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => refetch()}
                                    className={cn((isFetching && !isFetchingNextPage) && "animate-spin")}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* LIST OF EXPORTS */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <ChartLoader />
                                <p className="text-sm text-slate-500 mt-4 animate-pulse">Fetching your history...</p>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <Card className="border-dashed bg-transparent py-20">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <FileText className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No reports found</h3>
                                    <p className="text-slate-500 max-w-xs mt-1">
                                        {searchTerm || statusFilter !== "ALL"
                                            ? "Try adjusting your search or filters."
                                            : "You haven't exported any data yet."}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {filteredLogs.map((log) => (
                                    <Card key={log.id} className="group border-slate-200 hover:shadow-md hover:border-slate-300 transition-all">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row md:items-center p-5 gap-5">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-slate-900 p-3 rounded-xl">
                                                        <FileText className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-slate-900">
                                                                {log.device?.name || "Unknown Device"}
                                                            </h3>
                                                            <Badge variant="secondary" className="text-[10px] h-5 rounded px-1.5 font-black uppercase tracking-tighter">
                                                                {log.metadata?.type || 'DATA'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {log.fromDate ? new Date(log.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '...'} —
                                                                {log.toDate ? new Date(log.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                                                            </span>
                                                            {log.fileSize && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <HardDrive className="w-3.5 h-3.5" />
                                                                    {formatFileSize(log.fileSize)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 min-w-30">
                                                    <Badge className={cn(
                                                        "shadow-none border px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors",
                                                        log.status === "COMPLETED" && "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800",
                                                        log.status === "PROCESSING" && "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800",
                                                        log.status === "FAILED" && "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
                                                    )}>
                                                        {log.status}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        Requested {new Date(log.requestedAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center border-t md:border-t-0 pt-4 md:pt-0">
                                                    <Button
                                                        disabled={log.status !== "COMPLETED"}
                                                        onClick={() => handleDownload(log)}
                                                        size="sm"
                                                        className="w-full md:w-auto gap-2 bg-slate-900 cursor-pointer hover:bg-slate-800 text-white"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>

                                            {log.status === "FAILED" && log.errorMessage && (
                                                <div className="bg-red-50/50 px-5 py-2.5 border-t border-red-100 flex items-center gap-2">
                                                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                    <p className="text-[11px] text-red-600 font-semibold truncate">
                                                        {log.errorMessage}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* INFINITE SCROLL LOADER TARGET */}
                        <div ref={ref} className="py-10 flex justify-center">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                    <span className="text-xs text-slate-400">Loading more reports...</span>
                                </div>
                            ) : hasNextPage ? (
                                <div className="h-4 w-4 bg-slate-200 rounded-full animate-bounce" />
                            ) : allLogs.length > 0 && (
                                <p className="text-xs text-slate-400 italic">End of history</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExportHistory