"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { cn } from "@/lib/utils"

export default function LogoutPage() {
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setLoading(true)

            await signOut({
                redirect: false,
            })

            toast.success("Logged out successfully 👋")

            router.push("/user/sign-in")
        } catch (error) {
            toast.error("Logout failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                />
            </div>

            <main
                className={cn(
                    "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60"
                )}
            >
                <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                    <Card className="p-8 max-w-md w-full text-center space-y-6 animate-fade-in">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <LogOut className="w-8 h-8 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                Logout
                            </h1>
                            <p className="text-muted-foreground">
                                Are you sure you want to logout?
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent cursor-pointer"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant={"destructive"}
                                className="flex-1 cursor-pointer flex items-center justify-center gap-2"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                {loading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Logout
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}