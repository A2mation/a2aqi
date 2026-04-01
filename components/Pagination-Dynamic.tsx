"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPlaceName } from "@/helpers/format-place-name"

interface Props {
    items: string[]
}

const DynamicPagination = ({ items }: Props) => {
    const pathname = usePathname()

    if (!items || items.length === 0) return null

    let currentPath = "/dashboard"

    return (
        <nav aria-label="Breadcrumb" className="w-full">
            {/* - flex-wrap: Ensures items flow to next line instead of overlapping
                - items-center: Keeps icons and text aligned
                - gap-x-1: Tight spacing for a premium breadcrumb look 
            */}
            <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
                
                {/* Home/Dashboard Node */}
                <li className="flex items-center">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-200",
                            "hover:bg-secondary/80",
                            pathname === "/dashboard" 
                                ? "text-primary font-bold" 
                                : "text-muted-foreground"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span className="text-[10px] md:text-base font-black uppercase tracking-widest">
                            Dashboard
                        </span>
                    </Link>
                </li>

                {/* Dynamic Location Nodes */}
                {items.map((item, index) => {
                    const slugifiedItem = item.toLowerCase().trim().replace(/\s+/g, "-")
                    currentPath += `/${slugifiedItem}`
                    const isActive = pathname === currentPath

                    return (
                        <li key={currentPath} className="flex items-center gap-1">
                            {/* Separator Icon */}
                            <ChevronRight 
                                size={14} 
                                className="text-muted-foreground/30 shrink-0" 
                                strokeWidth={2.5} 
                            />

                            <Link
                                href={currentPath}
                                className={cn(
                                    "px-2 py-1 rounded-lg text-[10px] md:text-base transition-all duration-200",
                                    isActive 
                                        ? "text-foreground font-black bg-secondary/40 border border-border/20 shadow-sm" 
                                        : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/20"
                                )}
                            >
                                {formatPlaceName(item)}
                            </Link>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default DynamicPagination