"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Command, Loader2, X, Building2, Wind, Thermometer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getAQIBgColor } from "@/helpers/aqi-color-pallet";

type Result = {
    id: string;
    name: string;
    country: string;
    state?: string;
    aqi: number;
    temp: number;
    lat: number;
    lng: number;
}

interface MapSearchBarProps {
    onLocationSelect: (lat: number, lng: number) => void;
    setParameter: (parameter: string) => void;
    parameter: string
}

const MapSearchBar = ({ onLocationSelect, parameter, setParameter }: MapSearchBarProps) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 400);

    useOutsideClick(containerRef, () => setIsOpen(false));

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery) return null;
            const res = await http.get(`/api/aqi/search?q=${debouncedQuery}`);
            return res.data as { states: Result[]; cities: Result[] };
        },
        enabled: debouncedQuery.length > 0,
    });

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <div className="flex items-center h-14 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60 p-1.5 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)]">
            <div ref={containerRef} className="relative flex-1 flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city or state..."
                    className="h-11 border-none bg-transparent pl-10 pr-10 shadow-none focus-visible:ring-0 text-sm font-medium"
                />

                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {query && (
                        <button onClick={() => { setQuery(""); setIsOpen(false); }} className="p-1 hover:bg-muted rounded-md">
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* DROPDOWN FOR RESULTS */}
                {isOpen && query.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-3 w-full overflow-hidden rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="max-h-80 overflow-y-auto p-2">
                            {isLoading ? (
                                <SkeletonLoader />
                            ) : data && (data.states?.length > 0 || data.cities?.length > 0) ? (
                                <ResultsList
                                    data={data}
                                    onSelect={(item) => {
                                        setIsOpen(false);
                                        setQuery(item.name);
                                        onLocationSelect(item.lat, item.lng); // FLY TO TRIGGER
                                    }}
                                />
                            ) : (
                                <div className="p-8 text-center text-sm text-muted-foreground">No results found</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Separator orientation="vertical" className="h-6 mx-1 bg-slate-200" />

            <div className="min-w-40">
                <Select
                    value={parameter}
                    onValueChange={(value) => setParameter(value)}
                >
                    <SelectTrigger className="h-11 border-none flex items-center w-full bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 hover:bg-slate-100/50 rounded-xl transition-colors font-bold text-slate-600 gap-2 px-3">
                        <SelectValue placeholder="Parameter" />
                    </SelectTrigger>

                    <SelectContent className="rounded-2xl border-slate-200/60 shadow-2xl backdrop-blur-xl bg-white/95 min-w-30">
                        <SelectItem
                            value="aqi"
                            className="rounded-lg focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-colors m-1"
                        >
                            <div className="flex items-center gap-2.5 py-1">
                                <div className="p-1.5 bg-blue-100 rounded-md">
                                    <Wind className="w-3.5 h-3.5 text-blue-600" />
                                </div>
                                <span className="font-semibold text-xs tracking-wide">AQI</span>
                            </div>
                        </SelectItem>

                        <SelectItem
                            value="pm25"
                            className="rounded-lg focus:bg-orange-50 focus:text-orange-600 cursor-pointer transition-colors m-1"
                        >
                            <div className="flex items-center gap-2.5 py-1">
                                <div className="p-1.5 bg-orange-100 rounded-md">
                                    <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                                </div>
                                <span className="font-semibold text-xs tracking-wide">TEMP</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className="p-2 space-y-2">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3">
                <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
                <div className="h-8 w-12 bg-muted animate-pulse rounded-lg" />
            </div>
        ))}
    </div>
);

const ResultsList = ({ data, onSelect }: { data: any; onSelect: (item: Result) => void }) => (
    <div className="space-y-4">
        {Object.entries(data).map(([key, items]: [string, any]) => (
            items && items.length > 0 && (
                <div key={key}>
                    <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">
                        {key === 'states' ? <MapPin className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {key}
                    </div>
                    <div className="space-y-1">
                        {items.map((item: Result) => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-all"
                            >
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-bold">{item.name}</span>
                                    <span className="text-[11px] text-muted-foreground">{item.state ? `${item.state}, ` : ""}{item.country}</span>
                                </div>
                                <div className={cn("px-2.5 py-1 rounded-lg text-white text-xs font-black", getAQIBgColor(item.aqi))}>
                                    {item.aqi}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )
        ))}
    </div>
);

export default MapSearchBar;