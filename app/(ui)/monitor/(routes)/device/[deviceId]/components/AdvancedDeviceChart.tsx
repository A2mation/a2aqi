'use client'

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check } from 'lucide-react';

// Configuration for all possible parameters in your Prisma Model
const PARAM_CONFIG: Record<string, { color: string; label: string }> = {
    avgAqi: { color: '#4f46e5', label: 'AQI' },
    pm25: { color: '#06b6d4', label: 'PM2.5' },
    pm10: { color: '#8b5cf6', label: 'PM10' },
    temp: { color: '#f59e0b', label: 'Temp' },
    humidity: { color: '#3b82f6', label: 'Humidity' },
    co2: { color: '#10b981', label: 'CO2' },
};

const AdvancedDeviceChart = ({ hourlyData }: { hourlyData: any[] }) => {

    const [activeParams, setActiveParams] = useState<string[]>(['avgAqi']);


    const toggleParam = (key: string) => {
        setActiveParams((prev) =>
            prev.includes(key)
                ? (prev.length > 1 ? prev.filter((p) => p !== key) : prev) // Prevent deselecting all
                : [...prev, key]
        );
    };



    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">

            {/* --- Live Data Section --- */}
            <div className="mb-5 pb-8 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Live Metrics</h4>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase">Last sync: Just now</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(PARAM_CONFIG).map(([key, config]) => {
                        // In a real app, you'd get this from hourlyData[hourlyData.length - 1]
                        const latestValue = hourlyData[hourlyData.length - 1]?.[key] || '--';

                        return (
                            <div
                                key={key}
                                className="p-4 rounded-2xl border border-gray-200 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        {config.label}
                                    </span>
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: config.color }}
                                    />
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-gray-800 tracking-tight">
                                        {latestValue}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {key === 'temp' ? '°C' : key === 'humidity' ? '%' : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Header & Dynamic Toggles */}
            <div className="flex flex-col mb-8 gap-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Parameter Analysis</h3>
                        <p className="text-xs text-gray-400 font-medium">Select up to 6 parameters to compare trends</p>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {activeParams.length} ACTIVE
                    </div>
                </div>

                {/* Parameter Selectors */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(PARAM_CONFIG).map(([key, config]) => {
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
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                />
                                {config.label}
                                {isActive && <Check size={12} className="ml-1" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Chart */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {activeParams.map((param) => (
                                <linearGradient key={param} id={`color${param}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PARAM_CONFIG[param].color} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={PARAM_CONFIG[param].color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="hourStart"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                        />

                        <Tooltip
                            cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', padding: '2px 0' }}
                        />

                        {/* Dynamically Rendered Areas */}
                        {activeParams.map((param) => (
                            <Area
                                key={param}
                                type="monotone"
                                dataKey={param}
                                name={PARAM_CONFIG[param].label}
                                stroke={PARAM_CONFIG[param].color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#color${param})`}
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