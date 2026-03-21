'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Cpu, CheckCircle2, Circle, Zap, Activity, Info, Anchor } from 'lucide-react';

const TIMEFRAMES = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
];

const DEVICES = [
    { id: 'SN-7721-X9', location: 'Nagpur, IN', params: ['AQI', 'PM2.5', 'Temp'], color: '#6366f1' },
    { id: 'SN-8842-Y2', location: 'Mumbai, IN', params: ['AQI', 'PM2.5', 'Humidity'], color: '#06b6d4' },
    { id: 'SN-9901-B7', location: 'Bangalore, IN', params: ['AQI', 'PM2.5', 'Temp', 'Humidity'], color: '#10b981' },
];

const PARAMS = [
    { id: 'AQI', unit: '', threshold: 10 },
    { id: 'PM2.5', unit: 'µg/m³', threshold: 5 },
    { id: 'Temp', unit: '°C', threshold: 2 },
    { id: 'Humidity', unit: '%', threshold: 5 },
];

interface DeviceDataPoint {
    timestamp: string;
    [key: string]: any; // This "Index Signature" allows string indexing
}
const MultiDeviceSyncHub = () => {
    const [selectedDays, setSelectedDays] = useState(30);
    const [activeParam, setActiveParam] = useState('AQI');
    const [selectedDevices, setSelectedDevices] = useState(['SN-7721-X9', 'SN-8842-Y2']);
    const [isDeltaMode, setIsDeltaMode] = useState(false);
    const [baselineId, setBaselineId] = useState('SN-7721-X9');


    const fullHistory = useMemo<DeviceDataPoint[]>(() => {
        return Array.from({ length: 90 }).map((_, i) => {
            const base = 30 + Math.sin(i / 8) * 20;
            return {
                timestamp: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000)
                    .toLocaleDateString([], { month: 'short', day: 'numeric' }),
                'SN-7721-X9': base + Math.random() * 5,
                'SN-8842-Y2': base + 8 + Math.cos(i / 5) * 10,
                'SN-9901-B7': base - 4 + Math.sin(i / 4) * 8,
            };
        });
    }, []);

    const visibleData = useMemo(() => fullHistory.slice(-selectedDays), [selectedDays, fullHistory]);
    console.log(visibleData)

    const deltaData = useMemo(() => {
        return visibleData.map((entry: DeviceDataPoint) => {
            const result: DeviceDataPoint = { timestamp: entry.timestamp };
            selectedDevices.forEach(id => {
                result[id] = entry[id] - entry[baselineId];
            });
            return result;
        });
    }, [visibleData, selectedDevices, baselineId]);

    const toggleDevice = (id: string) => {
        setSelectedDevices(prev => {
            const isRemoving = prev.includes(id);
            if (isRemoving && prev.length <= 2) return prev;

            const next = isRemoving ? prev.filter(d => d !== id) : [...prev, id];

            if (isRemoving && id === baselineId) {
                setBaselineId(next[0]);
            }
            return next;
        });
    };

    const currentParam = PARAMS.find(p => p.id === activeParam);

    return (
        <div className="flex flex-col gap-6 p-8 bg-[#FDFDFD] min-h-screen text-slate-900">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter">
                        Telemetry <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">Divergence</span>
                    </h2>
                    <p className="text-sm text-gray-400 font-medium">
                        {isDeltaMode
                            ? `Comparing variance relative to ${selectedDevices[0]}`
                            : `Absolute trends for ${selectedDevices.length} nodes`}
                    </p>
                </div>

                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200/50">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setSelectedDays(tf.value)}
                            className={`relative px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${selectedDays === tf.value ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {selectedDays === tf.value && (
                                <motion.div layoutId="timePill" className="absolute inset-0 bg-gray-900 rounded-xl shadow-lg" />
                            )}
                            <span className="relative z-10">{tf.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* SIDEBAR */}
                <div className="w-full lg:w-80 space-y-4">
                    <div className="bg-indigo-50/50 p-4 rounded-4xl border border-indigo-100 mb-6">
                        <div className="flex items-center gap-2 text-indigo-600 mb-1">
                            <Info size={14} />
                            <span className="text-[10px] font-black uppercase">Baseline Node</span>
                        </div>
                        <p className="text-xs font-bold text-indigo-900">{baselineId}</p>
                    </div>

                    {DEVICES.map((dev) => {
                        const isSelected = selectedDevices.includes(dev.id);
                        const isBaseline = baselineId === dev.id;
                        return (
                            <div key={dev.id} className="relative group">
                                <button
                                    onClick={() => toggleDevice(dev.id)}
                                    className={`w-full flex items-center justify-between p-5 rounded-4xl border transition-all ${isSelected ? 'bg-gray-900 border-transparent shadow-xl' : 'bg-white border-gray-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-2xl ${isBaseline ? 'bg-amber-500 text-white' :
                                            isSelected ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'
                                            }`}>
                                            {isBaseline ? <Anchor size={18} /> : <Cpu size={18} />}
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-900'}`}>{dev.id}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{isBaseline ? 'PRIMARY REF' : dev.location}</p>
                                        </div>
                                    </div>
                                    {isSelected ? <CheckCircle2 size={18} className="text-indigo-400" /> : <Circle size={18} className="text-gray-100" />}
                                </button>

                                {/* FLOATING BASELINE SELECTOR */}
                                {isSelected && !isBaseline && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setBaselineId(dev.id);
                                        }}
                                        className="absolute -right-2 -top-2 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase z-10 border-2 border-white"
                                    >
                                        Set Baseline
                                    </motion.button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* MAIN ANALYTICS HUB */}
                <div className="flex-1 bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm ">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between gap-6 mb-12">
                        <div className="flex flex-wrap gap-2">
                            {PARAMS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setActiveParam(p.id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${activeParam === p.id ? 'bg-indigo-600 border-transparent text-white shadow-lg shadow-indigo-100' : 'bg-white border-gray-100 text-gray-400'
                                        }`}
                                >
                                    {p.id}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsDeltaMode(!isDeltaMode)}
                            className={`flex items-center gap-3 px-6 py-2 rounded-2xl text-[10px] font-black uppercase transition-all border ${isDeltaMode
                                ? 'bg-amber-500 border-transparent text-white shadow-xl shadow-amber-100 scale-105'
                                : 'bg-white border-gray-200 text-gray-400 hover:border-amber-200'
                                }`}
                        >
                            <Zap size={14} fill={isDeltaMode ? "white" : "none"} />
                            {isDeltaMode ? 'Divergence View' : 'Absolute View'}
                        </button>
                    </div>

                    {/* Chart Area */}
                    <div className="h-112.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={isDeltaMode ? deltaData : visibleData}>
                                <defs>
                                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#CBD5E1', fontWeight: 800 }} />
                                <YAxis hide domain={isDeltaMode ? ['dataMin - 5', 'dataMax + 5'] : ['auto', 'auto']} />
                                <Tooltip content={<PrecisionTooltip isDelta={isDeltaMode} unit={currentParam?.unit} />} />

                                {isDeltaMode && <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'right', value: 'BASELINE', fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />}

                                {selectedDevices.map((id, index) => {
                                    const device = DEVICES.find(d => d.id === id);
                                    return (
                                        <Area
                                            key={id}
                                            type="monotone"
                                            dataKey={id}
                                            stroke={isDeltaMode && index === 0 ? 'transparent' : (device?.color || '#6366f1')}
                                            strokeWidth={4}
                                            fill={isDeltaMode ? (index === 0 ? 'transparent' : 'url(#colorPos)') : 'transparent'}
                                            fillOpacity={1}
                                            stackId={isDeltaMode ? "1" : index.toString()}
                                        />
                                    );
                                })}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrecisionTooltip = ({ active, payload, label, isDelta, unit }: any) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-[2.5rem] shadow-2xl min-w-55">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">{label}</p>
            <div className="space-y-4">
                {payload.map((item: any, idx: number) => {
                    if (isDelta && idx === 0) return null; // Don't show baseline delta (it's always 0)
                    const val = Math.round(item.value * 10) / 10;
                    const isPos = val > 0;

                    return (
                        <div key={item.name} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stroke }} />
                                <span className="text-xs font-black text-slate-700">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-black ${isDelta ? (isPos ? 'text-emerald-500' : 'text-red-500') : 'text-slate-900'}`}>
                                    {isDelta && val > 0 ? '+' : ''}{val}
                                </span>
                                <span className="ml-1 text-[10px] font-bold text-gray-400">{unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isDelta && (
                <div className="mt-4 pt-3 border-t border-gray-50">
                    <p className="text-[9px] font-bold text-gray-400 italic">Values relative to {payload[0]?.name}</p>
                </div>
            )}
        </div>
    );
};

export default MultiDeviceSyncHub;