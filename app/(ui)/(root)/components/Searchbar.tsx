"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { http } from "@/lib/http"
import { getAQIBgColor, getAQITextColor } from "@/helpers/aqi-color-pallet"
import { cn } from "@/lib/utils"

type Result = {
    id: string
    name: string
    country: string
    state?: string
    aqi: number
}


const Searchbar = () => {
    const [query, setQuery] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<{
        states: Result[]
        cities: Result[]
    } | null>(null)


    useEffect(() => {
        if (!query) {
            setOpen(false)
            setResults(null)
            return
        }

        setOpen(true)
        setLoading(true)

        const controller = new AbortController()

        const timer = setTimeout(async () => {
            try {
                const res = await http.get(`/api/aqi/search?q=${query}`, {
                    signal: controller.signal,
                })
                const data = await res.data
                setResults(data)
            } catch (e) {
                if ((e as any).name !== "AbortError" && (e as any).code !== "ERR_CANCELED") {
                    console.error(e)
                }
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => {
            controller.abort()
            clearTimeout(timer)
        }
    }, [query])


    return (
        <div className="relative w-full md:w-70">
            {/* Search Input */}
            <div className="relative flex items-center justify-center">
                <Search className="absolute left-6 md:left-3 h-4 w-4 text-muted-foreground pointer-events-none" />

                <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    name="search"
                    className="
                        h-10
                        pl-10 pr-8
                        w-[90%]
                        md:w-full
                        rounded-lg
                        border border-slate-200
                        bg-white
                        text-base
                        text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:border-blue-600
                        focus:ring-2
                        focus:ring-blue-500/30
                        shadow-sm
                        transition
                    "
                />

                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-2 text-slate-400 hover:text-slate-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-lg">
                    {loading ? (
                        <Skeleton />
                    ) : (
                        results && <Results data={results} />
                    )}
                </div>
            )}
        </div>
    )
}

export default Searchbar



const Skeleton = () => {
    return (
        <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="h-11 w-full rounded-lg bg-slate-200 animate-pulse"
                />
            ))}
        </div>
    )
}


function slugify(value: string | undefined): string {
    if (value == undefined) return ''
    return value.toLowerCase().trim().replace(/\s+/g, "-")
}

const Results = ({
    data,
}: {
    data: { states: Result[]; cities: Result[] }
}) => {

    return (
        <div className="max-h-80 overflow-y-auto">

            {(["states", "cities"] as const).map(
                (section) =>
                    ( data[section] !== undefined && data[section].length > 0 ) && (
                        <div key={section}>
                            <p className="px-4  pt-4  pb-2 text-base font-semibold text-slate-500 uppercase">
                                {section}
                            </p>

                            {data[section].map((item) => (
                                <a
                                    key={item.id}
                                    href={
                                        section == 'states' ? `/dashboard/${slugify(item.country)}/${slugify(item.state)}` :
                                            section == 'cities' ? `/dashboard/${slugify(item.country)}/${slugify(item.state)}/${slugify(item.name)}` : ""
                                    }
                                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer"
                                >


                                    <div>
                                        <p className="text-lg font-medium text-slate-800">
                                            {item.name}
                                        </p>
                                        {item.country && (
                                            <p className="text-base text-slate-400">
                                                {item.country}
                                            </p>
                                        )}
                                    </div>

                                    <span
                                        className={cn(`px-3 py-1 rounded-md text-base font-semibold `,
                                            getAQIBgColor(item.aqi),
                                            "text-white"
                                        )}
                                    >
                                        {item.aqi}
                                    </span>

                                </a>
                            ))}
                        </div>
                    )
            )}
        </div>
    )
}
