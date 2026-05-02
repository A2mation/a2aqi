"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

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
import Link from "next/link";

enum DeviceStatus {
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
}

enum DeviceType {
  INDOOR = "INDOOR",
  OUTDOOR = "OUTDOOR",
}

const DUMMY_DEVICES = [
  {
    id: "65c3d4e5f6g7h8i9j0k1l1",
    name: "North Gateway Alpha",
    serialNo: "SN-2026-NX891",
    isActive: true,
    apiKey: "dev_live_79a2b8c9d1e2f3g4h5",
    type: DeviceType.OUTDOOR,
    location: "Mumbai Port Terminal",
    lat: 18.9438,
    lng: 72.8357,
    status: DeviceStatus.ASSIGNED,
    model: { name: "Astra-Node V2" },
    user: { name: "Aarav Sharma", email: "aarav.s@industrial.co" },
    createdAt: "2026-01-12T08:30:00Z",
  },
  {
    id: "65c3d4e5f6g7h8i9j0k1l2",
    name: "Warehouse Sensor 04",
    serialNo: "SN-2026-NX892",
    isActive: true,
    apiKey: "dev_live_12a3b4c5d6e7f8g9h0",
    type: DeviceType.INDOOR,
    location: "Bengaluru Logistics Hub",
    lat: 12.9716,
    lng: 77.5946,
    status: DeviceStatus.UNASSIGNED,
    model: { name: "Omni-Sense Mini" },
    user: null,
    createdAt: "2026-02-28T14:15:00Z",
  },
  {
    id: "65c3d4e5f6g7h8i9j0k1l3",
    name: "Perimeter Thermal Node",
    serialNo: "SN-2026-NX893",
    isActive: false,
    apiKey: "dev_live_55h6i7j8k9l0m1n2o3",
    type: DeviceType.OUTDOOR,
    location: "Kolkata Refinery",
    lat: 22.5726,
    lng: 88.3639,
    status: DeviceStatus.ASSIGNED,
    model: { name: "Astra-Node V2" },
    user: { name: "TechFlow Systems", email: "admin@techflow.io" },
    createdAt: "2026-04-01T11:45:00Z",
  },
];

const VendorDevicePageList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

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
            href={'/vendor/devices/register'}
            className={cn(
              buttonVariants({
                variant: 'default'
              }),
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
            { label: "Total Devices", value: "3", icon: Cpu, color: "text-blue-600" },
            { label: "Active Nodes", value: "2", icon: ShieldCheck, color: "text-emerald-600" },
            { label: "Inactive Nodes", value: "1", icon: ShieldAlert, color: "text-amber-600" },
            { label: "Outdoor Type", value: "2", icon: MapPin, color: "text-purple-600" },
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

        {/* Toolbar: Search, Filters & Actions */}
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
            <Button variant="outline" className="flex-1 md:flex-none">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Animated Custom Device List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {DUMMY_DEVICES.map((device) => (
            <motion.div
              key={device.id}
              variants={itemVariants}
              className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-4"
            >

              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                  <Cpu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2 flex-wrap">
                    {device.name || "Unnamed Device"}
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${device.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {device.isActive ? "Active" : "Offline"}
                    </Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 tracking-wider">
                      {device.serialNo}
                    </span>
                    <span className="text-gray-300 mx-1">|</span>
                    {device.model.name}
                  </p>
                </div>
              </div>

              {/* Data Properties */}
              <div className="grid grid-cols-2 md:flex md:items-center gap-6 w-full md:w-auto">
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
                    {device.apiKey.substring(0, 12)}•••
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group/btn text-xs font-semibold cursor-pointer hover:bg-primary/5 transition-all"
                >
                  View Node
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 ease-in-out group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Device Actions</DropdownMenuLabel>
                    <Separator className="my-1" />
                    <DropdownMenuItem>Configure Network</DropdownMenuItem>
                    <DropdownMenuItem>Regenerate API Key</DropdownMenuItem>
                    <DropdownMenuItem>View Readings</DropdownMenuItem>
                    
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer/Pagination */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <p className="text-sm text-muted-foreground">
            Showing <strong>3</strong> of <strong>3</strong> active devices
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
    </TooltipProvider >
  );
};

export default VendorDevicePageList;