import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const TIMEFRAMES = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '45D', value: 45 },
    { label: '90D', value: 90 },
];

const PARAMS = [
    { id: 'AQI', color: '#6366f1', shadow: 'shadow-indigo-200' },
    { id: 'PM2.5', color: '#06b6d4', shadow: 'shadow-cyan-200' },
    { id: 'PM10', color: '#8b5cf6', shadow: 'shadow-purple-200' },
    { id: 'Temp', color: '#f59e0b', shadow: 'shadow-orange-200' },
    { id: 'Humidity', color: '#3b82f6', shadow: 'shadow-blue-200' },
    { id: 'CO2', color: '#10b981', shadow: 'shadow-emerald-200' },
];

const CustomDays = () => {
    const [selectedDays, setSelectedDays] = useState(30);
    const [activeParams, setActiveParams] = useState<string[]>(['AQI']);

    // Generate stable mock data so it doesn't "jump" randomly
    const chartData = useMemo(() => {
        return Array.from({ length: 90 }).map((_, i) => ({
            name: i,
            date: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            AQI: 30 + Math.sin(i / 5) * 20 + Math.random() * 10,
            'PM2.5': 20 + Math.cos(i / 4) * 15 + Math.random() * 5,
            PM10: 25 + Math.sin(i / 3) * 10 + Math.random() * 8,
            Temp: 22 + Math.sin(i / 10) * 5,
            Humidity: 50 + Math.cos(i / 8) * 20,
            CO2: 12 + Math.random() * 5,
        }));
    }, []);

    const visibleData = useMemo(() => chartData.slice(-selectedDays), [selectedDays, chartData]);

    const toggleParam = (id: string) => {
        setActiveParams((prev) =>
            prev.includes(id)
                ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev)
                : [...prev, id]
        );
    };

    return (
        <div className="bg-white/80 mt-10 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] w-full">

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
                {/* Left Side: Title & Subtitle */}
                <div className="space-y-2 text-center md:text-left">
                    <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
                        <h3 className="font-black text-gray-900 text-2xl md:text-3xl tracking-tight">
                            Telemetry <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">Insights</span>
                        </h3>

                        {/* Active Badge */}
                        <span className="w-fit px-2.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-indigo-100/50">
                            {activeParams.length} Active
                        </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 font-medium max-w-sm mx-auto md:mx-0">
                        Comparative historical trends and environmental insights
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex justify-center md:justify-end">
                    <div className="flex w-full md:w-auto bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setSelectedDays(tf.value)}
                                className={`relative flex-1 md:flex-none px-4 lg:px-6 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-500 rounded-xl ${selectedDays === tf.value ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                                    }`}
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

            {/* Parameter Grid: Floating UI Style */}
            <div className="flex flex-wrap gap-4 mb-12">
                {PARAMS.map((param) => {
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
                                {param.id}
                            </span>
                            {active && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-indigo-300 font-black">✓</motion.span>}
                        </motion.button>
                    );
                })}
            </div>

            {/* Chart: Immersive & Clean */}
            <div className="h-100 w-full group/chart">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visibleData}>
                        <defs>
                            {PARAMS.map(p => (
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
                        />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                        />

                        {PARAMS.map((p) => activeParams.includes(p.id) && (
                            <Area
                                key={p.id}
                                type="basis"
                                dataKey={p.id}
                                stroke={p.color}
                                strokeWidth={4}
                                fill={`url(#grad-${p.id})`}
                                strokeLinecap="round"
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
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{label}</p>
            <div className="space-y-3">
                {payload.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.stroke }} />
                            <span className="text-xs font-bold text-gray-500">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{Math.round(item.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomDays;