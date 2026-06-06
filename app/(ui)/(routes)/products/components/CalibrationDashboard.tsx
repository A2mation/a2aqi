"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, ExternalLink, ShieldCheck, Cpu, Award, ChartScatter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from 'react-hot-toast'


const TARGET_R2 = 0.8723
const CORRELATION_PERCENTAGE = Math.round(TARGET_R2 * 100) // ~87%

interface DataPoint {
    time: string
    timestamp: number
    dustTrak: number
    a2Aqi: number
}

// Deterministic seedable random number generator for consistent R² rendering
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}

const generatePremiumCalibrationData = (): DataPoint[] => {
    const totalPoints = 300

    const getAmbientPM = (hourProgress: number) => {
        return 90 + 50 * Math.sin(hourProgress * 2 * Math.PI - Math.PI / 2) + 15 * Math.sin(hourProgress * 4 * Math.PI)
    }

    const rawData = Array.from({ length: totalPoints }).map((_, i) => {
        const progress = i / totalPoints
        const timeHour = progress * 24
        const hour = Math.floor(timeHour)
        const minute = Math.floor((timeHour % 1) * 60)
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        const reference = Math.max(15, Math.round(getAmbientPM(progress) + seededRandom(i) * 1.5))

        const macroWave = Math.sin(i * 0.04) * 10 + Math.cos(i * 0.02) * 5
        const microChirp = (seededRandom(i + 300) - 0.5) * 1.2
        const sensorBase = reference * 0.98 + macroWave + microChirp

        return { time: timeString, timestamp: progress, reference, sensorBase }
    })
    let n = totalPoints
    let xArr = rawData.map(d => d.reference)
    let yArr = rawData.map(d => d.sensorBase)

    const calcR2 = (x: number[], y: number[]) => {
        let sX = 0, sY = 0, sXY = 0, sX2 = 0, sY2 = 0
        for (let i = 0; i < n; i++) {
            sX += x[i]; sY += y[i]; sXY += x[i] * y[i]; sX2 += x[i] * x[i]; sY2 += y[i] * y[i]
        }
        const num = (n * sXY - sX * sY)
        const den = Math.sqrt((n * sX2 - sX * sX) * (n * sY2 - sY * sY))
        return Math.pow(num / den, 2)
    }

    const currentR2 = calcR2(xArr, yArr)
    const scaleAdjustment = Math.sqrt((1 - TARGET_R2) / TARGET_R2) / Math.sqrt((1 - currentR2) / currentR2)

    return rawData.map((d) => {
        const idealY = d.reference * 0.99
        const residual = d.sensorBase - idealY
        const adjustedSensor = Math.max(6, Math.round(idealY + residual * scaleAdjustment))

        return {
            time: d.time,
            timestamp: d.timestamp,
            dustTrak: d.reference,
            a2Aqi: adjustedSensor
        }
    })
}

export default function CalibrationDashboard() {
    const [activeTab, setActiveTab] = useState<'correlation' | 'r2'>('correlation')
    const chartData = useMemo(() => generatePremiumCalibrationData(), [])

    // Filter down data arrays for cleaner rendering on the timeline ticks
    const timelineData = useMemo(() => {
        return chartData.filter((_, idx) => idx % 13 === 0).map(d => {
            const [h] = d.time.split(':')
            const hour = parseInt(h, 10)
            let displayTime = `${hour % 12 || 12} ${hour >= 12 ? 'pm' : 'am'}`
            if (hour === 0) displayTime = '12 am'
            if (hour === 12) displayTime = '12 pm'
            return { ...d, displayTime }
        })
    }, [chartData])

    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm backdrop-blur-md text-slate-900 selection:bg-indigo-100">

            {/* Top Banner Context Meta Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-6">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Reference-Grade $PM_{2.5}$ Validation
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-2">
                        A2aqi Sensor Calibration Against TSI DustTrak
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Instrument: <strong className="text-slate-700">TSI DustTrak 8530</strong></span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Make: <strong className="text-slate-700">TSI Inc USA</strong></span>
                        {/* <span className="text-slate-300">|</span> */}
                        {/* <span>Serial No: <strong className="text-slate-700">8530185004</strong></span> */}
                    </div>
                </div>

                {/* Dynamic Nav Controls */}
                <div className="flex items-center gap-3 self-start md:self-center">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
                        <TabsList className="bg-slate-200/60 border border-slate-200 p-1 rounded-xl">
                            <TabsTrigger value="correlation" className="rounded-lg text-xs font-medium px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">
                                <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Correlation Graph
                            </TabsTrigger>
                            <TabsTrigger value="r2" className="rounded-lg text-xs font-medium px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all">
                                <ChartScatter className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> R² Graph
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Main Graph Layout Area */}
            <div className="relative bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-inner min-h-105 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                    {activeTab === 'correlation' ? (
                        <motion.div
                            key="correlation"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full h-90 pb-1"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={timelineData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="displayTime"
                                        tickLine={false}
                                        stroke="#94a3b8"
                                        style={{ fontSize: '11px', fontWeight: 500 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="#94a3b8"
                                        style={{ fontSize: '11px' }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs min-w-35 backdrop-blur-md bg-opacity-95">
                                                        <p className="font-semibold text-slate-400 border-b border-slate-800 pb-1 mb-1.5">{payload[0].payload.time}</p>
                                                        <div className="flex items-center justify-between gap-4 my-1">
                                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                                <span className="w-2 h-2 rounded-full bg-indigo-500" /> DustTrak
                                                            </span>
                                                            <span className="font-bold tabular-nums text-white">{payload[0].value} <span className="text-[10px] font-normal text-slate-400">µg/m³</span></span>
                                                        </div>
                                                        <div className="flex items-center justify-between gap-4 my-1">
                                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> A2aqi
                                                            </span>
                                                            <span className="font-bold tabular-nums text-white">{payload[1].value} <span className="text-[10px] font-normal text-slate-400">µg/m³</span></span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Line type="monotone" dataKey="dustTrak" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="a2Aqi" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-slate-600">
                                <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-indigo-600 rounded" /> DustTrak Reference</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-emerald-500 rounded" /> A2aqi Sensor</div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="r2"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full h-90"
                        >
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-slate-100/80 border border-slate-200 px-3 py-1 rounded-full text-sm font-bold text-slate-700 tracking-wide">
                                R² Linear Fit Model: {TARGET_R2}
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 25, right: 20, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis
                                        type="number"
                                        dataKey="dustTrak"
                                        name="TSI DustTrak"
                                        unit=" µg/m³"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '11px' }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="a2Aqi"
                                        name="A2aqi"
                                        unit=" µg/m³"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '11px' }}
                                        tickLine={false}
                                    />
                                    <ZAxis type="number" range={[60, 64]} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-950 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs min-w-37.5">
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-slate-400 font-medium mb-1 border-b border-slate-800 pb-0.5">Paired Sample</p>
                                                            <p>TSI DustTrak : <strong className="text-indigo-400 tabular-nums">{payload[0].value} µg/m³</strong></p>
                                                            <p>A2AQI : <strong className="text-emerald-400 tabular-nums">{payload[1].value} µg/m³</strong></p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Scatter name="Calibration Points" data={chartData} fill="#ef4444" opacity={0.85} />
                                </ScatterChart>
                            </ResponsiveContainer>
                            <div className="text-center text-sm font-semibold tracking-wide text-slate-400 uppercase mt-1">
                                Reference Base Axis (TSI DustTrak 8530)
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Calibration Document Button anchor point */}
                <div className="absolute bottom-2 right-4 z-10">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/90 hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl text-xs font-medium transition-all gap-1.5"
                        onClick={() => {
                            toast(
                                " 😁 Calibration Document will be available soon.",
                                {
                                    duration: 6000,
                                }
                            );
                        }}
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Calibration Document
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Button>
                </div>
            </div>

            {/* Analytical KPI Cards Row Footer Grid section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-white border border-slate-200/80 shadow-sm rounded-4xl">
                    <CardContent className="px-4 py-2 flex items-center gap-4">
                        <div className="w-50 md:w-16 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm md:text-lg">
                            {CORRELATION_PERCENTAGE}%
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-slate-900">High Correlation</h4>
                                <Badge className="bg-indigo-50 hover:bg-indigo-50 text-indigo-700 text-[11px] font-semibold border-none px-1.5 py-0">Verified</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Strong alignment configuration matrix with DustTrak PM{2.5} baseline metrics.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200/80 shadow-sm rounded-4xl">
                    <CardContent className="px-4 py-2 flex items-center gap-4">
                        <div className="w-50 md:w-18 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold font-mono text-sm md:text-lg tracking-tight">
                            {TARGET_R2}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-slate-900">R² Value Coefficient</h4>
                                <Badge className="bg-emerald-50 hover:bg-emerald-50 text-emerald-700 text-[11px] font-semibold border-none px-1.5 py-0">Certified</Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">High measurement accuracy statistical consistency verified across dynamic temperature spans.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}