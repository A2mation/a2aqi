'use client'

import { motion } from 'motion/react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Tables = () => {
    const data = [
        { level: "Good", range: "0-1.0", effect: "Air is good to inhale", color: "bg-green-500" },
        {
            level: "Satisfactory",
            range: "1.1-2.0",
            effect: "Slight headache experienced after 1-3 hours",
            color: "bg-green-400",
        },
        {
            level: "Moderate",
            range: "2.1-10",
            effect: "Nausea, drowsiness, dangerous after 3hrs of exposure",
            color: "bg-yellow-400",
        },
        {
            level: "Poor",
            range: "10-17",
            effect: "Qualmish, headache, death within 3 hrs of exposure",
            color: "bg-orange-500",
        },
        { level: "Very poor", range: "17-34", effect: "Exposures can cause death within 2 hrs", color: "bg-red-500" },
        { level: "Severe", range: "34+", effect: "Fatal within 60 minutes of exposure", color: "bg-red-600" },
    ]
    return (
        <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Carbon Monoxide Standards Tables */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Government Standards */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Carbon Monoxide</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-3 py-2 text-left font-semibold">Govt. Body</th>
                                            <th className="px-3 py-2 text-left font-semibold">Breakpoints</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-3 py-2">India</td>
                                            <td className="px-3 py-2">0.0-27 → Good</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2">EPA</td>
                                            <td className="px-3 py-2">0.0-44 → Good</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carbon Monoxide Standards */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Carbon Monoxide Standards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm md:text-base">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-3 py-2 text-left font-semibold">Organization</th>
                                            <th className="px-3 py-2 text-left font-semibold">Standards</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-3 py-2">California</td>
                                            <td className="px-3 py-2">8hrs - 9 PPM</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-3 py-2">AAQS</td>
                                            <td className="px-3 py-2">1 hour - 20 PPM</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2">WHO</td>
                                            <td className="px-3 py-2">24hrs - 3.5 PPM</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Health Effects Section */}
                <div>
                    <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                        Carbon Monoxide (CO) and the harm it causes
                    </h2>

                    <div
                        className="hidden lg:block"
                    >
                        <Card className="overflow-hidden">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="grid grid-cols-3 gap-0 divide-x"
                            >
                                {/* Levels Column */}
                                <div className="p-6">
                                    <h2 className="mb-4 text-2xl font-bold text-slate-900">Levels</h2>
                                    <div className="space-y-3 flex items-start gap-5 flex-col">
                                        {data.map((item) => (
                                            <div key={item.level} className="py-2 text-lg font-medium text-slate-700">
                                                {item.level}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Range Column */}
                                <div className="p-6">
                                    <h2 className="mb-4 text-2xl font-bold text-slate-900">(mg/m³)</h2>
                                    <div className="space-y-3 flex items-start gap-5 flex-col">
                                        {data.map((item) => (
                                            <div key={item.level} className="py-2 text-lg font-medium text-slate-700">
                                                {item.range}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Health Effects Column */}
                                <div className="p-6">
                                    <h2 className="mb-4 text-2xl font-bold text-slate-900">Health Effects</h2>
                                    <div className="space-y-3 ">
                                        {data.map((item) => (
                                            <div
                                                key={item.level}
                                                className={`${item.color} rounded-lg px-4 py-2 text-center text-lg font-semibold text-white`}
                                            >
                                                {item.effect}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </Card>
                    </div>

                    {/* Responsive Card Layout - Visible on mobile and tablet */}
                    <div className="lg:hidden space-y-4">
                        {data.map((item) => (
                            <Card key={item.level} className="overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <div className="mb-3 flex items-baseline justify-between gap-4">
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.level}</h3>
                                        <span className="text-sm font-medium text-slate-600">{item.range} mg/m³</span>
                                    </div>
                                    <div
                                        className={`${item.color} rounded-lg px-4 py-3 text-center text-sm sm:text-base font-semibold text-white`}
                                    >
                                        {item.effect}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 text-center text-xs sm:text-sm text-slate-600 italic">
                        *As per CBCB. 8-h hourly average values.
                    </div>
                </div>
            </div>

        </main >
    )
}

export default Tables
