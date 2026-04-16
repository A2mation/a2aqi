"use client"

import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldAlert,
  Cpu,
  Zap,
  MapPin,
  Activity,
  HardDrive,
  Plus
} from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTopLoader } from "nextjs-toploader"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Device {
  id: string
  name: string | null
  serialNo: string
  isActive: boolean
  type: "OUTDOOR" | "INDOOR"
  status: "UNASSIGNED" | "ASSIGNED" | "MAINTENANCE"
  location: string | null
  lat: number | null
  lng: number | null
  createdAt: string
}

interface DevicesResponse {
  devices: Device[];
  totalCount: number;
}

const ITEMS_PER_PAGE = 7

export default function ModeratorDevicePage() {
  const router = useRouter();
  const loader = useTopLoader();
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, isPlaceholderData } = useQuery<DevicesResponse>({
    queryKey: ["moderator-devices", searchQuery, currentPage],
    queryFn: async () => {
      const response = await http.get(`/api/moderators/devices`, {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const devices = data?.devices || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className={cn("min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#020617]")}>


      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Fleet Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Cpu size={14} /> Fleet Management
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Device Infrastructure
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              System-level oversight of active sensors and hardware nodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search Serial No..."
                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Button
              size="sm"
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              onClick={() => {
                loader.start();
                router.push(`/moderator/register-device`);
                loader.done();
              }}
            >
              <Plus className="h-4 w-4" /> Register Device
            </Button>
          </div>
        </div>

        {/* Device Table */}
        <div className={cn(
          "border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all",
          isPlaceholderData ? "opacity-50 pointer-events-none" : "opacity-100"
        )}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-6 py-5">Hardware Identity</th>
                  <th className="px-6 py-5">Node Type</th>
                  <th className="px-6 py-5">Geo-Coordinates</th>
                  <th className="px-6 py-5">System Status</th>
                  <th className="px-6 py-5 text-right">Connectivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <TableSkeleton />
                ) : devices.length > 0 ? (
                  devices.map((device) => (
                    <tr
                      key={device.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-indigo-500/5 cursor-pointer transition-all group"
                      onClick={() => {
                        loader.start();
                        router.push(`/moderator/devices/${device.id}`);
                        loader.done();
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <HardDrive size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                              SN: {device.serialNo}
                            </span>
                            <span
                              className="text-[11px] font-medium text-slate-500 font-mono truncate max-w-[20ch] cursor-help"
                              title={device.name || "Station Unnamed"}
                            >
                              {device.name || "Station Unnamed"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase">
                          {device.type === "OUTDOOR" ? <Zap size={10} className="mr-1 text-amber-500" /> : <Activity size={10} className="mr-1 text-blue-500" />}
                          {device.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <MapPin size={12} className="text-red-500" />
                            {device.location || "Floating Node"}
                          </div>
                          <span className="text-sm text-slate-400 font-mono ml-4">
                            {device.lat?.toFixed(4)}, {device.lng?.toFixed(4)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all duration-500 cursor-default flex items-center gap-2 w-fit",
                          "hover:-translate-y-0.5 hover:shadow-lg active:scale-95",

                          device.status === "ASSIGNED" ?
                            "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-200/50" :

                            device.status === "MAINTENANCE" ?
                              "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-500 hover:text-white hover:shadow-amber-200/50" :
                              "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white hover:shadow-rose-200/50"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            device.status === "ASSIGNED" ? "bg-emerald-500 animate-pulse" :
                              device.status === "MAINTENANCE" ? "bg-amber-500" : "bg-rose-500"
                          )} />

                          {device.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border",
                          device.isActive ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-red-50 text-red-700 border-red-100"
                        )}>
                          <div className={cn("h-1.5 w-1.5 rounded-full mr-2", device.isActive ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-red-500")} />
                          {device.isActive ? "UPLINK STABLE" : "LINK DISCONNECTED"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <ShieldAlert size={48} className="text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No Hardware Detected</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Reverted Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-5 bg-slate-50/50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Total Units: <span className="text-slate-900 dark:text-white ml-1">{totalCount}</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                Sector {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
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
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-b dark:border-slate-800 animate-pulse">
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>
          </div>
        </td>
        <td className="px-6 py-5"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" /></td>
        <td className="px-6 py-5"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" /></td>
        <td className="px-6 py-5"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" /></td>
        <td className="px-6 py-5 text-right"><div className="inline-block h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
      </tr>
    ))}
  </>
);