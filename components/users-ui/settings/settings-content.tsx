"use client"

import { ChevronRight, User, Bell, MapPin, Shield, Download } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
// import { useTheme } from "@/components/theme-provider"

export function SettingsContent() {
    // const { theme, setTheme } = useTheme()

    return (
        <div className="space-y-6 animate-fade-in ">
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
                <div className="space-y-6">

                    <div className="space-y-1">

                        {/* Manage Profile */}
                        <Link
                            href="/user/settings/profile"
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Manage Profile</p>
                                    <p className="text-sm text-muted-foreground">
                                        Update your name, email and password
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>


                        {/* View Account */}
                        <Link
                            href="/user/settings/account"
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">View Account</p>
                                    <p className="text-sm text-muted-foreground">Check your plan and account details</p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        {/* AQI Alerts */}
                        <Link
                            href="/user/settings/alerts"
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">AQI Alerts</p>
                                    <p className="text-sm text-muted-foreground">Set notifications for high pollution</p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        {/* Favorite Locations */}
                        <Link
                            href="/user/settings/locations"
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Saved Locations</p>
                                    <p className="text-sm text-muted-foreground">Manage your favorite AQI locations</p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        {/* Export Data */}
                        <Link
                            href="/user/settings/export"
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Export AQI Data</p>
                                    <p className="text-sm text-muted-foreground">Download reports and AQI history</p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Notifications</h3>
                <div className="space-y-4">





                    {[
                        { label: "Email notifications", description: "Receive email about your account activity" },
                        { label: "Push notifications", description: "Receive push notifications in your browser" },
                        { label: "Task reminders", description: "Get reminded about upcoming task deadlines" },
                        { label: "Team updates", description: "Notifications about team member activities" },
                    ].map((item, index) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                            <div>
                                <p className="font-medium">{item.label}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Switch defaultChecked={index < 2} />

                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Appearance</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Enable dark mode theme</p>
                        </div>
                        {/* <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} /> */}
                        <Switch checked />
                    </div>
                </div>
            </Card>
        </div>
    )
}
