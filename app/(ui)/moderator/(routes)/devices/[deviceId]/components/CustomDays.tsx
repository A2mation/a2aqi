'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';


import { DaysReading } from '@/types/monitors/monitor.analytics.type';

const TIMEFRAMES = [
    // { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    // { label: '45D', value: 45 },
    // { label: '90D', value: 90 },
];

const PARAM_MASTER_CONFIG = [
    { id: 'aqi', label: 'AQI', color: '#6366f1', shadow: 'shadow-indigo-200' },
    { id: 'pm25', label: 'PM2.5', color: '#06b6d4', shadow: 'shadow-cyan-200' },
    { id: 'pm10', label: 'PM10', color: '#8b5cf6', shadow: 'shadow-purple-200' },
    { id: 'pm1', label: 'PM1.0', color: '#6366f1', shadow: 'shadow-indigo-300' },
    { id: 'temperature', label: 'Temp', color: '#f59e0b', shadow: 'shadow-orange-200' },
    { id: 'humidity', label: 'Humidity', color: '#3b82f6', shadow: 'shadow-blue-200' },
    { id: 'co2', label: 'CO2', color: '#10b981', shadow: 'shadow-emerald-200' },
    { id: 'co', label: 'CO', color: '#14b8a6', shadow: 'shadow-teal-200' },
    { id: 'no2', label: 'NO2', color: '#ef4444', shadow: 'shadow-red-200' },
    { id: 'so2', label: 'SO2', color: '#f97316', shadow: 'shadow-orange-400' },
    { id: 'o3', label: 'Ozone', color: '#ec4899', shadow: 'shadow-pink-200' },
    { id: 'tvoc', label: 'TVOC', color: '#84cc16', shadow: 'shadow-lime-200' },
    { id: 'noise', label: 'Noise', color: '#a855f7', shadow: 'shadow-purple-400' },
    { id: 'smoke', label: 'Smoke', color: '#64748b', shadow: 'shadow-slate-300' },
    { id: 'methane', label: 'Methane', color: '#adff2f', shadow: 'shadow-green-200' },
    { id: 'ammonia', label: 'Ammonia', color: '#fbbf24', shadow: 'shadow-yellow-300' },
    { id: 'h2', label: 'H2', color: '#22d3ee', shadow: 'shadow-cyan-400' },
    { id: 'h2s', label: 'H2S', color: '#94a3b8', shadow: 'shadow-slate-400' },
];

const CustomDays = ({
    deviceId,
    last30days
}: {
    deviceId: string;
    last30days: DaysReading[]
}) => {
    const [selectedDays, setSelectedDays] = useState(30);
    const [activeParams, setActiveParams] = useState<string[]>(['aqi']);


    const availableParams = useMemo(() => {
        if (!last30days.length) return [];
        return PARAM_MASTER_CONFIG.filter(param =>
            last30days.some(reading =>
                reading[param.id as keyof DaysReading] !== null &&
                reading[param.id as keyof DaysReading] !== undefined
            )
        );
    }, [last30days]);

    const toggleParam = (id: string) => {
        setActiveParams((prev) =>
            prev.includes(id)
                ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev)
                : [...prev, id]
        );
    };


    return (
        <div className="bg-white/80 mt-10 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] w-full min-h-150">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
                        <h3 className="font-black text-gray-900 text-2xl md:text-3xl tracking-tight">
                            Telemetry <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">Insights</span>
                        </h3>
                        <span className="w-fit px-2.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-indigo-100/50">
                            {activeParams.length} Active
                        </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 font-medium max-w-sm mx-auto md:mx-0">
                        Showing data for the last {selectedDays} days
                    </p>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="flex w-full md:w-auto bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setSelectedDays(tf.value)}
                                className={`relative flex-1 md:flex-none px-4 lg:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-xl ${selectedDays === tf.value ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {selectedDays === tf.value && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-gray-900 rounded-xl shadow-lg shadow-gray-200"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tf.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
                {availableParams.map((param) => {
                    const active = activeParams.includes(param.id);
                    return (
                        <motion.button
                            key={param.id}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleParam(param.id)}
                            className={`group flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${active
                                ? `bg-gray-900 border-transparent shadow-xl ${param.shadow}`
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                                }`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'scale-125 ring-4 ring-white/20' : ''}`}
                                style={{ backgroundColor: param.color }}
                            />
                            <span className={`text-xs font-bold tracking-wide ${active ? 'text-white' : 'text-gray-500'}`}>
                                {param.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <div className="h-100 w-full group/chart relative">

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={last30days}>
                        <defs>
                            {availableParams.map(p => (
                                <linearGradient key={p.id} id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={p.color} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={p.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }}
                            dy={20}
                            tickFormatter={(str) => {
                                const d = new Date(str);
                                return isNaN(d.getTime()) ? str : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            }}
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />

                        {availableParams.map((p) => activeParams.includes(p.id) && (
                            <Area
                                key={p.id}
                                type="monotone"
                                dataKey={p.id}
                                stroke={p.color}
                                strokeWidth={4}
                                fill={`url(#grad-${p.id})`}
                                strokeLinecap="round"
                                connectNulls={true}
                                animationDuration={1000}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-4xl shadow-2xl ring-1 ring-black/5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                {new Date(label).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <div className="space-y-3">
                {payload.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.stroke }} />
                            <span className="text-xs font-bold text-gray-500 uppercase">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{item.value ? Math.round(item.value * 10) / 10 : 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomDays;