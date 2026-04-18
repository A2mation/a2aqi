'use client'

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check } from 'lucide-react';
import { latestSensorReading } from '@prisma/client';

const PARAM_CONFIG: Record<string, { color: string; label: string; unit: string }> = {
    aqi: { color: '#4f46e5', label: 'AQI', unit: '' },
    pm25: { color: '#06b6d4', label: 'PM2.5', unit: 'µg/m³' },
    pm10: { color: '#8b5cf6', label: 'PM10', unit: 'µg/m³' },
    pm1: { color: '#6366f1', label: 'PM1.0', unit: 'µg/m³' },
    temperature: { color: '#f59e0b', label: 'Temp', unit: '°C' },
    humidity: { color: '#3b82f6', label: 'Humidity', unit: '%' },
    co2: { color: '#10b981', label: 'CO2', unit: 'ppm' },
    co: { color: '#14b8a6', label: 'CO', unit: 'mg/m³' },
    no2: { color: '#ef4444', label: 'NO2', unit: 'ppb' },
    so2: { color: '#f97316', label: 'SO2', unit: 'ppb' },
    o3: { color: '#ec4899', label: 'Ozone', unit: 'ppb' },
    tvoc: { color: '#84cc16', label: 'TVOC', unit: 'mg/m³' },
    smoke: { color: '#64748b', label: 'Smoke', unit: '%' },
    noise: { color: '#a855f7', label: 'Noise', unit: 'dB' },
    methane: { color: '#adff2f', label: 'Methane', unit: 'ppm' },
    ammonia: { color: '#fbbf24', label: 'Ammonia', unit: 'ppm' },
    h2: { color: '#22d3ee', label: 'H2', unit: 'ppm' },
    h2s: { color: '#94a3b8', label: 'H2S', unit: 'ppm' },
};

interface Props {
    hourlyData: any[];
    liveData: latestSensorReading;
}

const AdvancedDeviceChart = ({ hourlyData, liveData }: Props) => {
    const [activeParams, setActiveParams] = useState<string[]>(['aqi', 'pm25']);

    // 1. Chart Data Processing
    const chartData = useMemo(() => {
        if (!hourlyData || hourlyData.length === 0) return [];
        return hourlyData[0].slots || [];
    }, [hourlyData]);

    // 2. Extract non-null parameters for UI rendering
    const availableParams = useMemo(() => {
        return Object.entries(PARAM_CONFIG).filter(([key]) => {
            const val = liveData[key as keyof latestSensorReading];
            return val !== null && val !== undefined;
        });
    }, [liveData]);

    const getLiveValue = (key: keyof latestSensorReading) => {
        const val = liveData[key];

        if (val === undefined || val === null) {
            return '--';
        }

        if (typeof val === 'number') {
            return Math.round(val * 10) / 10;
        }

        if (val instanceof Date) {
            return val.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return val.toString();
    };

    const toggleParam = (key: string) => {
        setActiveParams((prev) =>
            prev.includes(key)
                ? (prev.length > 1 ? prev.filter((p) => p !== key) : prev)
                : [...prev, key]
        );
    };

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">

            {/* Live Metrics Header */}
            <div className="mb-1 pb-4 border-b border-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Live Metrics</h4>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">
                        Sync: {liveData.measuredAt ? new Date(liveData.measuredAt).toLocaleTimeString() : 'Just now'}
                    </span>
                </div>

                {/* Grid only renders parameters that are not null */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {availableParams.map(([key, config]) => (
                        <div key={key} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12px] font-black text-gray-400 uppercase tracking-tighter">{config.label}</span>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-gray-800 tracking-tight">
                                    {getLiveValue(key as keyof latestSensorReading)}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">{config.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Parameter Selectors - Also filtered to only show available sensors */}
            <div className="flex flex-col mb-8 gap-6 pt-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Parameter Analysis</h3>
                        <p className="text-xs text-gray-400 font-medium">Toggle metrics to update chart trends</p>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {activeParams.length} ACTIVE
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {availableParams.map(([key, config]) => {
                        const isActive = activeParams.includes(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleParam(key)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${isActive
                                    ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                                {config.label}
                                {isActive && <Check size={12} className="ml-1" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Responsive Chart */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {activeParams.map((param) => (
                                <linearGradient key={param} id={`color${param}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PARAM_CONFIG[param]?.color} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={PARAM_CONFIG[param]?.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} />
                        <Tooltip
                            cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                            content={<CustomTooltip />}
                        />
                        {activeParams.map((param) => (
                            <Area
                                key={param}
                                type="monotone"
                                dataKey={param}
                                stroke={PARAM_CONFIG[param]?.color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#color${param})`}
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

export default AdvancedDeviceChart;


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