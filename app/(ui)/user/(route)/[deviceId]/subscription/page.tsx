"use client"

import Link from "next/link"

export default function SubscriptionPage() {
    // Dummy data (replace later with DB data)
    const subscription = {
        planName: "Pro",
        status: "Active",
        expiresAt: "31 Dec 2026",
        maxDevices: 5,
        usedDevices: 3,
        price: 7999,
    }

    const deviceUsagePercentage =
        (subscription.usedDevices / subscription.maxDevices) * 100

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Your Subscription</h1>
                    <p className="text-gray-400">
                        Manage your plan, devices, and billing.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">

                    {/* Plan Info */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {subscription.planName} Plan
                            </h2>
                            <p className="text-gray-400">
                                ₹{subscription.price} / year
                            </p>
                        </div>

                        <span className="px-4 py-2 rounded-full text-sm bg-green-600">
                            {subscription.status}
                        </span>
                    </div>

                    {/* Expiry */}
                    <div className="border-t border-zinc-800 pt-4">
                        <p className="text-gray-400 text-sm">Expires On</p>
                        <p className="text-lg font-medium">
                            {subscription.expiresAt}
                        </p>
                    </div>

                    {/* Device Usage */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>
                                Devices Used: {subscription.usedDevices} /{" "}
                                {subscription.maxDevices}
                            </span>
                            <span>
                                {subscription.maxDevices === null
                                    ? "Unlimited"
                                    : `${Math.round(deviceUsagePercentage)}%`}
                            </span>
                        </div>

                        {subscription.maxDevices !== null && (
                            <div className="w-full bg-zinc-800 rounded-full h-3">
                                <div
                                    className="bg-white h-3 rounded-full transition-all"
                                    style={{ width: `${deviceUsagePercentage}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Link
                            href="/user/pricing"
                            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
                        >
                            Upgrade Plan
                        </Link>

                        <Link
                            href="/user/payments"
                            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
                        >
                            View Payment History
                        </Link>
                    </div>
                </div>

                {/* Warning if near limit */}
                {subscription.maxDevices !== null &&
                    subscription.usedDevices >= subscription.maxDevices && (
                        <div className="bg-red-900/40 border border-red-700 rounded-xl p-4 text-sm">
                            ⚠ You have reached your device limit. Upgrade your plan to add more devices.
                        </div>
                    )}
            </div>
        </div>
    )
}