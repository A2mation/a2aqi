"use client"

import {
    LayoutDashboard,
    MonitorSmartphone,
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    Bot,
    Sparkles,
    Wand2,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from "lucide-react"
import Link from "next/link"
import { redirect, useParams, usePathname } from "next/navigation"
import { useState, createContext, useContext } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NavbarLogo } from "@/components/ui/resizable-navbar"

// Create context for sidebar collapse state
const SidebarContext = createContext<{
    isCollapsed: boolean
    setIsCollapsed: (collapsed: boolean) => void
}>({
    isCollapsed: false,
    setIsCollapsed: () => { },
})

export const useSidebar = () => useContext(SidebarContext)


export function Sidebar({ isCollapsed = false, onToggle }: { isCollapsed?: boolean; onToggle?: () => void } = {}) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const pathname = usePathname()
    const { deviceId } = useParams();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: `/user/${deviceId}/dashboard` },
        { icon: MonitorSmartphone, label: "Devices", badge: "6", href: `/user/${deviceId}/devices` },
        { icon: MapPin, label: "Map", href: `/user/${deviceId}/map` },
        { icon: BarChart3, label: "Analytics", href: `/user/${deviceId}/analytics` },
        { icon: Users, label: "Team", href: `/user/${deviceId}/team` },
    ]

    const aiItems = [
        { icon: Bot, label: "AI Assistant", badge: "New", href: `/user/${deviceId}/ai-assistant` },
        { icon: Sparkles, label: "Content Generator", href: `/user/${deviceId}/content-generator` },
        { icon: Wand2, label: "Smart Suggestions", href: `/user/${deviceId}/suggestions` },
    ]

    const generalItems = [
        { icon: Settings, label: "Settings", href: `/user/${deviceId}/settings` },
        { icon: HelpCircle, label: "Help", href: `/user/${deviceId}/help` },
        { icon: LogOut, label: "Logout", href: `/user/${deviceId}/logout` },
    ]

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto lg:block transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-65",
            )}
        >
            <div className={cn("p-4", isCollapsed && "px-2")}>
                <div className={cn("mb-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <NavbarLogo />
                    )}
                    {onToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className={cn(
                                "h-7 w-7 rounded-lg hover:bg-sidebar-accent",
                                isCollapsed && "mx-auto",
                            )}
                        >
                            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        {!isCollapsed && (
                            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-2">
                                WORKSPACE
                            </p>
                        )}
                        <nav className="space-y-0.5">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        title={isCollapsed ? item.label : undefined}
                                        className={cn(
                                            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-normal transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                                            isCollapsed && "justify-center",
                                        )}
                                    >
                                        <item.icon className={cn("w-4 h-4", isCollapsed && "w-4.5 h-4.5")} />
                                        {!isCollapsed && (
                                            <>
                                                <span className="text-base">{item.label}</span>
                                                {item.badge && (
                                                    <span className="ml-auto bg-muted text-foreground text-[10px] font-medium px-1.5 py-0.5 rounded">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div>
                        {!isCollapsed && (
                            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-2">
                                AI TOOLS
                            </p>
                        )}
                        <nav className="space-y-0.5">
                            {aiItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        title={isCollapsed ? item.label : undefined}
                                        className={cn(
                                            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-normal transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                                            isCollapsed && "justify-center",
                                        )}
                                    >
                                        <item.icon className={cn("w-4 h-4", isCollapsed && "w-4.5 h-4.5")} />
                                        {!isCollapsed && (
                                            <>
                                                <span className="text-base">{item.label}</span>
                                                {item.badge && (
                                                    <span className="ml-auto bg-muted text-foreground text-sm font-medium px-1.5 py-0.5 rounded">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    <div>
                        {!isCollapsed && (
                            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-2">
                                GENERAL
                            </p>
                        )}
                        <nav className="space-y-0.5">
                            {generalItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        title={isCollapsed ? item.label : undefined}
                                        className={cn(
                                            "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-normal transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                                            isCollapsed && "justify-center",
                                        )}
                                    >
                                        <item.icon className={cn("w-4 h-4", isCollapsed && "w-4.5 h-4.5")} />
                                        {!isCollapsed && <span className="text-base">{item.label}</span>}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </aside>
    )
}
