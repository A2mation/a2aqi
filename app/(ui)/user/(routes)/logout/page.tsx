"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { cn } from "@/lib/utils"

export default function LogoutPage() {
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className={cn(
                "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                isCollapsed ? "lg:ml-16" : "lg:ml-60",
            )}>

                <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                    <Card className="p-8 max-w-md w-full text-center space-y-6 animate-fade-in">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <LogOut className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Logout</h1>
                            <p className="text-muted-foreground">Are you sure you want to logout?</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => router.push("/")}>
                                Logout
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}
