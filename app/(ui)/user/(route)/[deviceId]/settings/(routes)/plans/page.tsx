"use client"

import React, { useState } from "react"
import {
    Zap,
    Check,
    Plus,
    CreditCard,
    ArrowUpRight,
    ShieldCheck,
    HelpCircle,
    Info,
    Smartphone
} from "lucide-react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// --- DUMMY DATA ---
const PRICING_PLANS = [
    {
        name: "Basic",
        price: "₹499",
        duration: "/mo per device",
        description: "Essential monitoring for home users.",
        features: ["7-day data retention", "Email alerts", "Basic CSV exports", "1 User access"],
        buttonText: "Current Plan",
        current: true,
    },
    {
        name: "Pro",
        price: "₹1,299",
        duration: "/mo per device",
        description: "Advanced analytics for researchers.",
        features: ["90-day data retention", "SMS & WhatsApp alerts", "Priority exports", "5 User access", "API Access"],
        buttonText: "Upgrade to Pro",
        current: false,
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        duration: "",
        description: "For large scale industrial deployments.",
        features: ["Unlimited retention", "Custom dashboard", "Dedicated support", "White-label reports", "On-premise option"],
        buttonText: "Contact Sales",
        current: false,
    }
]

const BillingAndPlans = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <section className="min-h-screen bg-slate-50/50 pb-20">
            <div className="flex">
                <div className="hidden lg:block">
                    <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                </div>

                <div className={cn(
                    "flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60"
                )}>
                    <Header
                        title="Billing & Plans"
                        description="Manage your subscriptions, payment methods, and plan features."
                    />

                    <div className="mt-8 space-y-8 max-w-6xl mx-auto">

                        {/* CURRENT STATUS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-none shadow-sm bg-blue-700 text-white">
                                <CardHeader className="pb-2">
                                    <CardDescription className="text-blue-100 flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-current" />
                                        Current Plan
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black">Pro Tier</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-blue-100">Active for 4 devices</p>
                                </CardContent>
                                <CardFooter>
                                    <Badge className="bg-blue-600 text-white border-none">Renews on Mar 24</Badge>
                                </CardFooter>
                            </Card>

                            <Card className="border-slate-200">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center justify-between">
                                        Export Credits
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></TooltipTrigger>
                                                <TooltipContent>Number of high-resolution PDF/CSV reports remaining this month.</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-black">42 / 100</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Progress value={42} className="h-2 bg-slate-100" />
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200">
                                <CardHeader className="pb-2">
                                    <CardDescription>Default Method</CardDescription>
                                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                                        <div className="bg-slate-100 p-1 rounded">
                                            <CreditCard className="w-5 h-5 text-slate-600" />
                                        </div>
                                        •••• 4242
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 font-medium">Visa • Expires 12/28</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* PLAN SELECTION */}
                        <div className="space-y-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-xl font-bold text-slate-900">Choose a Plan</h2>
                                <p className="text-sm text-slate-500">Scale your monitoring as your needs grow.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PRICING_PLANS.map((plan) => (
                                    <Card key={plan.name} className={cn(
                                        "relative flex flex-col border-2 transition-all duration-300",
                                        plan.popular ? "border-blue-600 shadow-xl shadow-blue-50" : "border-slate-200 hover:border-slate-300"
                                    )}>
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                                                Most Popular
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                                            <div className="mt-2 flex items-baseline gap-1">
                                                <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                                                <span className="text-sm font-medium text-slate-500">{plan.duration}</span>
                                            </div>
                                            <CardDescription className="mt-2">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature) => (
                                                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                                        <div className="bg-emerald-100 p-0.5 rounded-full">
                                                            <Check className="w-3 h-3 text-emerald-600" />
                                                        </div>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                variant={plan.current ? "outline" : plan.popular ? "default" : "secondary"}
                                                className={cn("w-full font-bold", plan.popular && "bg-blue-600 hover:bg-blue-700")}
                                                disabled={plan.current}
                                            >
                                                {plan.buttonText}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* ADDITIONAL INFO SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200 border-dashed">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Secure Payments</h4>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            Payments are processed securely via Razorpay. We do not store your full card details on our servers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200 border-dashed">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                        <Smartphone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Device Subscriptions</h4>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            Subscriptions are managed per device. You can transfer a subscription from one device to another once every 30 days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default BillingAndPlans