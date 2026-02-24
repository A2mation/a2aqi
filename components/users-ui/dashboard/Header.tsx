"use client"

import type { ReactNode } from "react"
import { Search, Mail, Bell, User, Settings, CreditCard, LogOut, History } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface HeaderProps {
    title: string
    description: string
    actions?: ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
    const session = useSession();
    const {
        deviceId
    } = useParams();

    return (
        <header className="space-y-3 px-2">
            <div className="flex items-center justify-between gap-3 mb-8">
                <div className="flex items-center gap-2 flex-1">
                    <MobileNav />

                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search"
                            className="pl-9 pr-3 h-9 text-sm bg-card border-border rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg"
                            >
                                <Mail className="w-5 h-5 text-slate-600" />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64 p-3">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-semibold">Messages</h4>
                                <p className="text-xs text-muted-foreground">
                                    You have no new unread messages.
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    {/* Notifications HoverCard */}
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-9 w-9 rounded-lg"
                            >
                                <Bell className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive border-2 border-white rounded-full" />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Notifications</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Export #1294 has been completed successfully.
                                    </p>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
                        {session.data && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 rounded-lg transition-colors group">
                                        <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-blue-700/20 transition-all">
                                            <AvatarFallback className="text-xs bg-blue-700 text-white font-bold">
                                                {session.data.user.name
                                                    ?.split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56 mt-2 shadow-xl border-slate-200" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal gap-2">
                                        <div className="flex flex-col space-y-1 py-2">
                                            <p className="text-sm font-bold leading-none">{session.data.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.data.user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            className="cursor-pointer py-2 font-medium"
                                        >
                                            <Link
                                                href={`/user/${deviceId}/settings/account`}
                                                className="flex items-center"
                                            >
                                                <User className="mr-2 h-4 w-4 text-slate-500" />
                                                <span>View Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer py-2 font-medium">
                                            <Link
                                                href={`/user/${deviceId}/settings/profile`}
                                                className="flex items-center"
                                            >
                                                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                                                <span>Account Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer py-2 font-medium">
                                            <Link
                                                href={`/user/${deviceId}/settings/payments`}
                                                className="flex items-center"
                                            >
                                                <History className="mr-2 h-4 w-4 text-slate-500" />
                                                <span>Payments History</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer py-2 font-medium">
                                            <Link
                                                href={`/user/${deviceId}/settings/plans`}
                                                className="flex items-center"
                                            >
                                                <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
                                                <span>Billing & Plans</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive font-bold"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {actions && <div className="flex flex-col sm:flex-row gap-2">{actions}</div>}
        </header>
    )
}
