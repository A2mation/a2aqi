"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Receipt,
    Search,
    Filter,
    CreditCard,
    ArrowDownToLine,
    Cpu,
    CalendarDays,
    Tag,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// --- DUMMY DATA GENERATOR ---
const DUMMY_PAYMENTS = [
    {
        id: "65d8f1e2...",
        deviceId: "dev_1",
        device: { name: "Living Room Sensor" },
        amount: 1499.00,
        discountAmount: 200.00,
        finalAmount: 1299.00,
        currency: "INR",
        status: "SUCCESS",
        razorpayOrderId: "order_Nkh782Hjs92",
        razorpayPaymentId: "pay_Nkh901Ks82",
        paidAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        coupon: { code: "WELCOME200" }
    },
    {
        id: "65d8f1e3...",
        deviceId: "dev_2",
        device: { name: "Office AQI Monitor" },
        amount: 2999.00,
        discountAmount: 0,
        finalAmount: 2999.00,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: "order_Plq291Msn22",
        razorpayPaymentId: null,
        paidAt: null,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        coupon: null
    },
    {
        id: "65d8f1e4...",
        deviceId: "dev_1",
        device: { name: "Living Room Sensor" },
        amount: 999.00,
        discountAmount: 100.00,
        finalAmount: 899.00,
        currency: "INR",
        status: "FAILED",
        razorpayOrderId: "order_Xyz123Abc45",
        razorpayPaymentId: "pay_Err99201",
        paidAt: null,
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        coupon: { code: "SAVE100" }
    }
]

const PaymentHistory = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isClient, setIsClient] = useState(false)

    const statusConfig = {
        SUCCESS: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
        PENDING: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
        FAILED: { color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
    }

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (!isClient) {
        return null;
    }

    return (
        <section className="min-h-screen bg-slate-50/50">
            <div className="flex">
                <div className="hidden lg:block">
                    <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                </div>

                <div className={cn(
                    "flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60"
                )}>
                    <Header
                        title="Payment History"
                        description="Track your device subscriptions, renewals, and billing details."
                    />

                    <div className="mt-8 space-y-6 max-w-6xl mx-auto">

                        {/* SEARCH & FILTERS */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by Order ID or Device..."
                                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-40 bg-white">
                                        <Filter className="w-4 h-4 mr-2 text-slate-500" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Payments</SelectItem>
                                        <SelectItem value="SUCCESS">Success</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* LIST OF PAYMENTS */}
                        <div className="grid gap-4">
                            {DUMMY_PAYMENTS.map((payment) => {
                                const StatusIcon = statusConfig[payment.status as keyof typeof statusConfig]?.icon || Clock

                                return (
                                    <Card key={payment.id} className="group border-slate-200 hover:shadow-md hover:border-slate-300 transition-all ">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row p-5 gap-6">

                                                {/* Left: Device & Order Info */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-slate-900 p-3 rounded-xl shadow-lg shadow-slate-200">
                                                        <CreditCard className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-slate-900">{payment.device.name}</h3>
                                                            <span className="text-slate-300">|</span>
                                                            <span className="text-xs font-mono text-slate-500">{payment.razorpayOrderId}</span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <CalendarDays className="w-3.5 h-3.5" />
                                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Cpu className="w-3.5 h-3.5" />
                                                                {payment.deviceId.substring(0, 8)}...
                                                            </span>
                                                            {payment.coupon && (
                                                                <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                                    <Tag className="w-3 h-3" />
                                                                    {payment.coupon.code}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Center: Amount Breakdown */}
                                                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end px-0 md:px-6 border-slate-100 md:border-x">
                                                    <div className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {payment.discountAmount > 0 && (
                                                                <span className="text-xs text-slate-400 line-through">₹{payment.amount}</span>
                                                            )}
                                                            <span className="text-lg font-black text-slate-900">
                                                                {payment.currency === "INR" ? "₹" : "$"}{payment.finalAmount}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                            {payment.status === "SUCCESS" ? `Paid on ${new Date(payment.paidAt!).toLocaleDateString()}` : "Total Amount"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right: Status & Action */}
                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 min-w-35">
                                                    <Badge className={cn(
                                                        "shadow-none border px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5",
                                                        statusConfig[payment.status as keyof typeof statusConfig]?.color
                                                    )}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {payment.status}
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-[11px] font-bold gap-2 hover:bg-slate-900 hover:text-white transition-all"
                                                        disabled={payment.status !== "SUCCESS"}
                                                    >
                                                        <ArrowDownToLine className="w-3.5 h-3.5" />
                                                        Invoice
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Razorpay Footer Info (Optional) */}
                                            {payment.razorpayPaymentId && (
                                                <div className="bg-slate-50/50 px-5 py-2 border-t border-slate-100 flex items-center justify-between">
                                                    <p className="text-[10px] text-slate-400">
                                                        Transaction ID: <span className="font-mono">{payment.razorpayPaymentId}</span>
                                                    </p>
                                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PaymentHistory