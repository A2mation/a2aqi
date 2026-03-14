"use client"

import { ChevronRight, User, Bell, MapPin, Shield, Download, MapPinned, Lock } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
// import { useTheme } from "@/components/theme-provider"

export function SettingsContent() {
    // const { theme, setTheme } = useTheme()
    const { deviceId } = useParams();

    return (
        <div className="space-y-6 animate-fade-in ">
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
                <div className="space-y-6">

                    <div className="space-y-1">

                        {/* Manage Profile */}
                        <Link
                            href={`/user/${deviceId}/settings/profile`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Manage Profile</p>
                                    <p className="text-sm text-muted-foreground">
                                        Update your name, email and password
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>

                        <Link
                            href={`/user/${deviceId}/settings/manage-address`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPinned className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm tracking-tight">Manage Addresses</p>
                                    <p className="text-xs text-muted-foreground">
                                        Add, edit, or set your primary billing address
                                    </p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>


                        {/* View Account */}
                        <Link
                            href={`/user/${deviceId}/settings/account`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Shield className="w-5 h-5 " />
                                </div>
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
                        {/* <Link
                            href={`/user/${deviceId}/settings/alerts`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        > */}
                        <div
                            className="relative flex items-center justify-between py-3 border-b border-border px-2 rounded-lg transition-all opacity-60 grayscale cursor-not-allowed group "
                        >
                            <div className="flex items-center gap-3">
                                {/* Muted Icon Background */}
                                <div className="p-2 bg-muted rounded-full text-muted-foreground transition-colors">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-muted-foreground">AQI Alerts</p>
                                        {/* Visual indicator for 'In Progress' */}
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                            Soon
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground/70">Set notifications for high pollution</p>
                                </div>
                            </div>

                            {/* Using Lock icon instead of Chevron to denote restricted access */}
                            <div className="pr-2">
                                <Lock className="w-4 h-4 text-primary" />
                            </div>

                            {/* Background texture to reinforce the 'coming soon' state */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.01)_50%,transparent_75%)] bg-size-[15px_15px]" />
                        </div>
                        {/* </Link> */}

                        {/* Favorite Locations */}
                        {/* <Link
                            href={`/user/${deviceId}/settings/locations`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        > */}
                        <div
                            className="relative flex items-center justify-between py-3 border-b border-border px-2 rounded-lg transition-all opacity-60 grayscale cursor-not-allowed group "
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full text-muted-foreground transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-muted-foreground flex items-center gap-2">
                                        Saved Locations
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                            Soon
                                        </span>
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">Manage your favorite AQI locations</p>
                                </div>
                            </div>
                            <div className="pr-2">
                                <Lock className="w-4 h-4 text-primary" />
                            </div>

                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.02)_50%,transparent_75%)] bg-size-[20px_20px]" />
                        </div>
                        {/* </Link> */}

                        {/* Export Data */}
                        <Link
                            href={`/user/${deviceId}/settings/export`}
                            className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 px-2 rounded-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Download className="w-5 h-5 " />
                                </div>
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

            <Card className="p-6 relative ">
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-primary/20">
                        Coming Soon
                    </span>
                </div>

                <h3 className="font-semibold text-lg mb-6">Notifications</h3>

                {/* Blurred/Disabled Container */}
                <div className="space-y-4 opacity-50 grayscale-[0.3] pointer-events-none select-none">
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
                            <Switch disabled defaultChecked={index < 2} />
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 relative ">
                <div className="absolute top-6 right-6">
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-primary/20">
                        Soon
                    </span>
                </div>

                <h3 className="font-semibold text-lg mb-6">Appearance</h3>

                <div className="space-y-4 opacity-50 grayscale-[0.3] pointer-events-none select-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">Enable dark mode theme</p>
                        </div>
                        <Switch disabled checked />
                    </div>
                </div>
            </Card>
        </div>
    )
}
