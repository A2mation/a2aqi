"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, MapPin, Thermometer, Droplets, Info, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NearbyCities, useLocationStore } from "@/store/location.store";
import { getAQIColor, getAQIStatus } from "@/helpers/aqi-color-pallet";


interface AQILocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
    temp: number;
    status: string;
    humidity: number;
    source: string;
    pm25?: number;
}

type SortKey = keyof AQILocation;
type SortOrder = "asc" | "desc";

export default function AirPollutionTable() {
    const [sortKey, setSortKey] = useState<SortKey>("aqi");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const {
        nearbyCities,
        loading: isLoading,
        error
    } = useLocationStore();

    const markers: AQILocation[] = nearbyCities.map((city: NearbyCities) => ({
        id: city.id || city.location || Math.random().toString(),
        name: city.location,
        lat: city.lat,
        lng: city.lng,
        aqi: city.aqi ?? 0,
        temp: city.temperature ?? city.temperature ?? 0,
        status: getAQIStatus(city.aqi ?? 0),
        humidity: city.humidity ?? 0,
        pm25: city.pm25 ?? 0,
        source: city.source ?? "CPCB",
    }));

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const sortedLocations = markers ? [...markers].sort((a, b) => {
        const aVal = a[sortKey] ?? 0;
        const bVal = b[sortKey] ?? 0;

        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    }) : [];

    if (error) {
        return (
            <section className="bg-white py-16 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center gap-4 py-24">
                        <Info className="w-12 h-12 text-red-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Failed to load nearby stations</h2>
                        <p className="text-slate-500">Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#F8FAFC] py-16 px-4 md:px-12">
            <div className="max-w-7xl h-fit mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Station Intelligence</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight md:text-5xl">
                            Nearby <span className="text-slate-400 font-light italic">Readings</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 text-sm font-medium max-w-xs md:text-right leading-relaxed">
                        Aggregated real-time data from localized environmental sensors.
                    </p>
                </div>

                {/* --- Table Glass Container --- */}
                <div className="relative rounded-[3rem] border border-slate-100 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)]">
                    <div>
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50/40  backdrop-blur-xl border-b border-slate-100">
                                    <Th label="Location" icon={<MapPin className="w-3 h-3" />} sortKey="name" activeKey={sortKey} order={sortOrder} onClick={() => handleSort("name")} />
                                    <Th label="Status" sortKey="status" activeKey={sortKey} order={sortOrder} onClick={() => handleSort("status")} />
                                    <Th label="AQI" sortKey="aqi" activeKey={sortKey} order={sortOrder} onClick={() => handleSort("aqi")} />
                                    <Th label="Condition" sortKey="temp" activeKey={sortKey} order={sortOrder} onClick={() => handleSort("temp")} />
                                    <th className="px-8 py-6 font-black text-sm uppercase tracking-[0.2em] text-slate-300">Origin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <TableSkeleton rows={5} />
                                ) : sortedLocations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <SearchX className="w-12 h-12" />
                                                <p className="text-sm font-bold uppercase tracking-widest">No Stations Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {sortedLocations.map((loc, i) => (
                                            <motion.tr
                                                key={loc.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="group hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-7">
                                                    <span className="font-bold text-slate-800 text-xl tracking-tight group-hover:text-blue-600 transition-colors">
                                                        {loc.name}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <Badge
                                                        variant="outline"
                                                        style={{
                                                            borderColor: `${getAQIColor(loc.aqi)}22`,
                                                            color: getAQIColor(loc.aqi),
                                                            backgroundColor: `${getAQIColor(loc.aqi)}08`
                                                        }}
                                                        className="rounded-full border px-4 py-1 text-md font-black uppercase tracking-tighter"
                                                    >
                                                        {loc.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="flex flex-col">
                                                        <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none"
                                                            style={{
                                                                color: getAQIColor(loc.aqi),
                                                            }}
                                                        >
                                                            {loc.aqi}
                                                        </span>

                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="flex gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <Thermometer className="w-6 h-6 text-orange-400/60" />
                                                            <span className="text-md font-bold text-slate-600">{loc.temp.toFixed(1)}°</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Droplets className="w-6 h-6 text-blue-400/60" />
                                                            <span className="text-md font-bold text-slate-600">{loc.humidity.toFixed(2)}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded shadow-sm border border-white">
                                                        {loc.source}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Th({ label, icon, sortKey, activeKey, order, onClick }: any) {
    const isActive = activeKey === sortKey;
    return (
        <th onClick={onClick} className="px-8 py-6 text-sm font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-blue-600 transition-all select-none">
            <div className="flex items-center gap-2">
                {icon}
                <span className={isActive ? "text-slate-900" : ""}>{label}</span>
                {isActive && (
                    <motion.div layoutId="sort" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}>
                        {order === "asc" ? <ChevronUp className="w-3 h-3 text-blue-500" /> : <ChevronDown className="w-3 h-3 text-blue-500" />}
                    </motion.div>
                )}
            </div>
        </th>
    );
}

export function TableSkeleton({ rows }: { rows: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-8 py-7"><Skeleton className="h-5 w-full rounded-full opacity-40" /></td>
                    ))}
                </tr>
            ))}
        </>
    );
}