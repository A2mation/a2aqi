"use client";

import {
  Plus,
  Search,
  MoreVertical,
  Cpu,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Key,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DeviceStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import Heading from "@/components/ui/Heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";


interface Device {
  id: string;
  name: string;
  serialNo: string;
  isActive: boolean;
  apiKey: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  model: { name: string };
  user: { name: string; email: string } | null;
  createdAt: string;
}

const VendorDevicePageList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mount, setMount] = useState(false);

  const {
    data: devices = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery < Device[] > ({
    queryKey: ["vendor-devices"],
    queryFn: async () => {
      const res = await http.get("/api/vendor/devices");

      if (res.status === 200 && !res.data.error) {
        return res.data;
      }

      throw new Error(res.data.message || 'Something Went Wrong')
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 1,
  });

  // --- Filtering Logic ---
  const filteredDevices = useMemo(() => {
    if (!devices) return [];

    if (searchTerm.trim() == '') {
      return devices;
    }

    return devices.filter((device) =>
      [device.name, device.serialNo, device.model.name].some((val) =>
        val?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [devices, searchTerm]);

  // --- Analytics Calculation ---
  const stats = {
    total: devices.length,
    active: devices.filter((d) => d.isActive).length,
    inactive: devices.filter((d) => !d.isActive).length,
    outdoor: devices.filter((d) => d.type === "OUTDOOR").length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };


  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;


  return (
    <TooltipProvider>
      <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 min-h-screen">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Heading
            title="Device Inventory"
            description="Manage and monitor physical edge devices, network types, and operational status."
            Icon={Cpu}
          />
          <Link
            href={"/vendor/devices/register"}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-primary hover:opacity-90 transition-all shadow-md w-full md:w-auto self-end md:self-center"
            )}
          >
            <Plus className="mr-2 h-4 w-4" /> Register Device
          </Link>
        </div>

        <Separator className="bg-gray-200" />

        {/* Dynamic Analytics */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {[
            { label: "Total Devices", value: stats.total, icon: Cpu, color: "text-blue-600" },
            { label: "Active Nodes", value: stats.active, icon: ShieldCheck, color: "text-emerald-600" },
            { label: "Inactive Nodes", value: stats.inactive, icon: ShieldAlert, color: "text-amber-600" },
            { label: "Outdoor Type", value: stats.outdoor, icon: MapPin, color: "text-purple-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, serial, or model..."
              className="pl-10 bg-gray-50/50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading device inventory...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-red-50/50 border-red-100">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-semibold text-red-900">Failed to load devices</h3>
            <p className="text-red-600 mb-4 text-sm">Please check your connection and try again.</p>
            <Button variant="destructive" onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-gray-50/50">
            <p className="text-muted-foreground">No devices found matching your search.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial={false}
            animate="visible"
            className="grid gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredDevices.map((device) => (
                <motion.div
                  key={device.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full md:w-1/3">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                      <Cpu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2 flex-wrap">
                        {device.name || "Unnamed Device"}

                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 tracking-wider">
                          SN:{device.serialNo}
                        </span>
                        <span className="text-gray-300 mx-1">|</span>
                        MN:{device.model?.name}
                      </p>
                    </div>
                  </div>

                  {/* Data Properties */}
                  <div className="grid grid-cols-2 md:flex md:items-center gap-20 w-full md:w-auto">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Location & Type</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {device.location || "Coordinates Only"}
                      </p>
                      <Badge variant="secondary" className="text-[10px] font-semibold bg-gray-100 hover:bg-gray-100 text-gray-700 select-none">
                        {device.type}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Assignment Status</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`h-2 w-2 rounded-full ${device.status === DeviceStatus.ASSIGNED ? "bg-blue-500" : "bg-gray-400"}`} />
                        <p className="text-sm font-semibold capitalize text-gray-700">
                          {device.status.toLowerCase()}
                        </p>
                      </div>
                      {device.user && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-blue-600 underline cursor-pointer">
                              {device.user.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-slate-900 text-white p-2 text-xs">
                            {device.user.email}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    <div className="space-y-1 hidden lg:block">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Access Key</p>
                      <p className="text-xs font-mono text-gray-500 flex items-center gap-1 mt-1">
                        <Key className="h-3 w-3 text-gray-400" />
                        {device.apiKey?.substring(0, 12)}•••
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${device.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {device.isActive ? "Active" : "Offline"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Device Actions</DropdownMenuLabel>
                        <Separator className="my-1" />
                        <DropdownMenuItem disabled>Configure Network</DropdownMenuItem>
                        <DropdownMenuItem disabled>Regenerate API Key</DropdownMenuItem>
                        <DropdownMenuItem disabled>View Readings</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer/Pagination */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredDevices.length}</strong> of <strong>{devices.length}</strong> devices
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VendorDevicePageList;