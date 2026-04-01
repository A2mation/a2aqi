"use client"

import { useState, useRef } from "react"
import { Search, X, MapPin, Building2, Loader2, Command } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { http } from "@/lib/http"
import { getAQIBgColor } from "@/helpers/aqi-color-pallet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"
import { useOutsideClick } from "@/hooks/use-outside-click"

type Result = {
    id: string
    name: string
    country: string
    state?: string
    aqi: number
}

const Searchbar = () => {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const debouncedQuery = useDebounce(query, 400)

    useOutsideClick(containerRef, () => setIsOpen(false))

    const { data, isLoading } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery) return null
            const res = await http.get(`/api/aqi/search?q=${debouncedQuery}`)
            
            return res.data as { states: Result[]; cities: Result[] }
        },
        enabled: debouncedQuery.length > 0,
    })

    return (
        <div ref={containerRef} className="relative w-full max-w-md group">
            {/* Search Input Container */}
            <div className={cn(
                "relative flex items-center transition-all duration-300 rounded-2xl border bg-background shadow-sm px-4",
                isOpen ? "ring-2 ring-primary/20 border-primary shadow-md" : "border-border hover:border-muted-foreground/50"
            )}>
                <Search className={cn(
                    "h-4 w-4 transition-colors",
                    isOpen ? "text-primary" : "text-muted-foreground"
                )} />

                <input
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city or state..."
                    className="flex-1 h-12 bg-transparent pl-3 pr-2 text-sm focus:outline-none placeholder:text-muted-foreground/60"
                />

                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {query && (
                        <button
                            onClick={() => { setQuery(""); setIsOpen(false); }}
                            className="p-1 hover:bg-muted rounded-md transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                    {!query && (
                        <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[10px] text-muted-foreground font-mono">
                            <Command className="h-2.5 w-2.5" /> K
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (query.length > 0) && (
                <div className="absolute z-50 mt-3 w-full overflow-hidden rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-100 overflow-y-auto p-2 scrollbar-thin">
                        {isLoading ? (
                            <SkeletonLoader />
                        ) : data && (data.states || data.cities) &&(data.states.length > 0 || data.cities.length > 0) ? (
                            <ResultsList data={data} onSelect={() => setIsOpen(false)} />
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const ResultsList = ({ data, onSelect }: { data: any, onSelect: () => void }) => {
    return (
        <div className="space-y-4">
            {Object.entries(data).map(([key, items]: [string, any]) => {
                if (items.length === 0 && !items) return null
                return (
                    <div key={key}>
                        <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">
                            {key === 'states' ? <MapPin className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                            {key}
                        </div>
                        <div className="space-y-1">
                            {items.map((item: Result) => (
                                <Link
                                    key={item.id}
                                    onClick={onSelect}
                                    href={key === 'states'
                                        ? `/dashboard/${slugify(item.country)}/${slugify(item.name)}`
                                        : `/dashboard/${slugify(item.country)}/${slugify(item.state)}/${slugify(item.name)}`
                                    }
                                    className="flex items-center justify-between group/item p-3 rounded-xl hover:bg-primary/5 transition-all duration-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                                            {item.name}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {item.state ? `${item.state}, ` : ""}{item.country}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 px-2.5 py-1 rounded-lg text-white text-xs font-black shadow-sm transition-transform group-hover/item:scale-110",
                                        getAQIBgColor(item.aqi)
                                    )}>
                                        {item.aqi}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const SkeletonLoader = () => (
    <div className="p-2 space-y-2">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded-md" />
                </div>
                <div className="h-8 w-12 bg-muted animate-pulse rounded-lg" />
            </div>
        ))}
    </div>
)

function slugify(value?: string): string {
    if (!value) return ""
    return value.toLowerCase().trim().replace(/\s+/g, "-")
}

export default Searchbar