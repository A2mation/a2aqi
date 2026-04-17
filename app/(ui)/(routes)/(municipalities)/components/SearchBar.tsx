'use client'

import React, { useMemo, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";
import { StationData } from "./Map";
import { MapPinOff } from "lucide-react";

// Defining a single Station type for clarity
export type Station = {
    id: string;
    lat: number;
    lng: number;
    aqi: number;
    temperature: number;
    location?: string;
};

export type StationDataProps = Station[];

const MUMBAI_COORDS = { lat: 19.1553, lng: 72.9438 };
const MAX_DISTANCE_KM = 50;

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const SimpleStationMonitor: React.FC<{
    data: StationDataProps,
    setSelectedStation: (station: StationData) => void
}> = ({ data, setSelectedStation }) => {
    const [selectedId, setSelectedId] = useState<string>("");

    const nearbyStations = useMemo(() => {
        return data
            .map((s) => ({ ...s, location: s.location || "Mumbai" }))
            .filter((s) => {
                const distance = getDistance(MUMBAI_COORDS.lat, MUMBAI_COORDS.lng, s.lat, s.lng);
                return distance <= MAX_DISTANCE_KM;
            });
    }, [data]);

    const handleStationChange = (id: string) => {
        setSelectedId(id);

        // Find the full station object from the filtered list
        const fullStation = nearbyStations.find((s) => s.id === id);

        if (fullStation) {
            setSelectedStation(fullStation);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Select Nearby Station
                </label>

                <Select onValueChange={handleStationChange} value={selectedId}>
                    <SelectTrigger className="w-full rounded-xl border-slate-500 shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Choose a station..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-2xl border-slate-100">
                        <SelectGroup>
                            <SelectLabel className="px-2 py-1.5 text-blue-600 font-bold text-xs uppercase tracking-tighter">
                                Stations in Mumbai
                            </SelectLabel>

                            {nearbyStations.map((station) => (
                                <SelectItem key={station.id} value={station.id} className="rounded-lg cursor-pointer transition-colors focus:bg-blue-50">
                                    <div className="flex items-center justify-between w-full gap-8">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{station.location}</span>
                                            <span className="text-[9px] text-slate-400 font-medium">AQI: {station.aqi} • {station.temperature}°C</span>
                                        </div>
                                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">
                                            {station.id.length > 4
                                                ? `ID: (${station.id.substring(0, 6).toUpperCase()})`
                                                : station.id
                                            }
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}

                            {nearbyStations.length === 0 && (
                                <div className="p-8 text-center space-y-2">
                                    <div className="flex justify-center text-slate-300">
                                        <MapPinOff size={24} />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        No stations within {MAX_DISTANCE_KM}km
                                    </p>
                                </div>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SimpleStationMonitor;