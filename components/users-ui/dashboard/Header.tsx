"use client"

import { Search, Mail, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import type { ReactNode } from "react"
import { useSession } from "next-auth/react"

interface HeaderProps {
    title: string
    description: string
    actions?: ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
    const session = useSession();

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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                    >
                        <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 rounded-lg"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                    </Button>

                    <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
                        {
                            session.data && (
                                <>
                                    <Avatar className="w-10 h-10 mr-2 cursor-pointer">
                                        <AvatarFallback className="text-xs bg-blue-700 text-primary-foreground font-medium">
                                            {session.data.user.name
                                                ?.split(" ")
                                                .map((n: any) => n[0])
                                                .join("")
                                                .toUpperCase()
                                            }
                                        </AvatarFallback>

                                    </Avatar>
                                    <div className="text-base hidden lg:block">
                                        <p className="font-medium text-foreground">{session.data.user.name}</p>
                                        <p className="text-muted-foreground text-[12px]">{session.data.user.email}</p>
                                    </div>
                                </>
                            )
                        }
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
