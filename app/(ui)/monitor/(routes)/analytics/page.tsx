'use client'

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, CheckCircle2, Circle, Zap, Info, Anchor, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { http } from '@/lib/http';
import { useSession } from 'next-auth/react';
import Header from '@/components/monitor/Header';
import { COLORS, SENSORUNIT } from '@/constant/sensor-units';
import AddDeviceModal from '@/components/modals/monior-add-device-modal';

import { PrecisionTooltip } from './components/PrecisionTooltip';
import { SyncHubSkeleton } from './components/SyncHubSkeleton';

interface Device {
    id: string;
    serialNo: string;
    modelName: string;
    location: string;
    color?: string;
}

interface HistoryEntry {
    timestamp: string;
    [serialNo: string]: any;
}

const TIMEFRAMES = [
    { label: '7 D', value: 7 },
    { label: '30 D', value: 30 },
    { label: '90 D', value: 90 },
];

const intervalMap: Record<number, number> = {
    7: 0,
    30: 1,
    90: 2,
};

const MultiDeviceSyncHub = () => {
    const session = useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState(30);
    const [activeParam, setActiveParam] = useState('aqi');
    const [isDeltaMode, setIsDeltaMode] = useState(false);
    const [baselineId, setBaselineId] = useState < string > ('');
    const [selectedDevices, setSelectedDevices] = useState < string[] > ([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['monitorAnalytics', session.data?.user.id],
        queryFn: async () => {
            const response = await http.get(`/api/monitor/analytics?monitorId=${session.data?.user.id}`);
            console.log( response.data)
            return response.data;
        },
        enabled: !!session.data,
        staleTime: 1000 * 60 * 5
    });

    // Handle initial selection: Show all in list, but only check first 2
    useEffect(() => {
        if (data?.devices?.length > 0 && selectedDevices.length === 0) {
            const firstTwo = data.devices.slice(0, 2).map((d: any) => d.serialNo);
            setSelectedDevices(firstTwo);
            setBaselineId(firstTwo[0]);
        }
    }, [data, selectedDevices.length]);

    const devicesList = useMemo < Device[] > (() => {
        if (!data?.devices) return [];
        return data.devices.map((d: any, index: number) => ({
            ...d,
            id: d.serialNo,
            color: COLORS[index % COLORS.length]
        }));
    }, [data]);


    const processedData = useMemo(() => {
        if (!data?.history) return [];
        const slice = data.history.slice(-selectedDays);

        return slice.map((entry: HistoryEntry) => {
            const dataPoint: any = {
                timestamp: new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
            };

            devicesList.forEach(dev => {
                const val = entry[dev.serialNo]?.[activeParam];
                dataPoint[dev.serialNo] = val !== undefined ? val : null;
            });

            return dataPoint;
        });
    }, [data, selectedDays, activeParam, devicesList]);

    const divergenceData = useMemo(() => {
        return processedData.map((entry: any) => {
            const result: any = { timestamp: entry.timestamp };
            selectedDevices.forEach(id => {
                if (entry[id] !== null && entry[baselineId] !== null) {
                    result[id] = entry[id] - entry[baselineId];
                } else {
                    result[id] = 0;
                }
            });
            return result;
        });
    }, [processedData, selectedDevices, baselineId]);

    const toggleDevice = (id: string) => {
        setSelectedDevices(prev => {
            const isRemoving = prev.includes(id);
            if (isRemoving && prev.length <= 1) return prev;
            const next = isRemoving ? prev.filter(d => d !== id) : [...prev, id];
            if (isRemoving && id === baselineId) setBaselineId(next[0]);
            return next;
        });
    };

    const getUnit = (key: string) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        return SENSORUNIT[formattedKey] || "";
    };

    const dynamicParams = useMemo(() => {
        if (!data?.history || devicesList.length === 0) return [];
        const paramSet = new Set < string > ();

        data.history.forEach((entry: any) => {
            devicesList.forEach(dev => {
                const deviceData = entry[dev.serialNo];
                if (deviceData) {
                    Object.keys(deviceData).forEach(key => {
                        if (key !== 'timestamp') paramSet.add(key);
                    });
                }
            });
        });

        return Array.from(paramSet).sort();
    }, [data, devicesList]);

    useEffect(() => {
        if (dynamicParams.length > 0 && !dynamicParams.includes(activeParam)) {
            setActiveParam(dynamicParams[0]);
        }
    }, [dynamicParams, activeParam]);

    if (isLoading) return <SyncHubSkeleton />;

    if (isError) return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#FDFDFD]">
            <AlertCircle className="text-red-500" size={40} />
            <p className="text-sm font-black text-slate-900">Failed to fetch analytics data.</p>
        </div>
    );

    return (
        <div className="bg-[#FDFDFD] min-h-screen text-slate-900">
            <Header setIsOpen={setIsOpen} />

            <div className='flex flex-col gap-6 p-8 '>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white py-4 px-8 rounded-4xl border border-gray-100 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tighter">
                            Telemetry <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">Divergence</span>
                        </h2>
                        <p className="text-sm text-gray-400 font-medium">
                            {isDeltaMode
                                ? `Comparing variance relative to ${baselineId}`
                                : `Absolute trends for ${selectedDevices.length} nodes`}
                        </p>
                    </div>

                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200/50">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setSelectedDays(tf.value)}
                                className={`relative px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${selectedDays === tf.value ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <AnimatePresence>
                                    {selectedDays === tf.value && (
                                        <motion.div
                                            layoutId="timePill"
                                            className="absolute inset-0 bg-gray-900 rounded-xl shadow-lg"
                                        />
                                    )}
                                </AnimatePresence>
                                <span className="relative z-10">{tf.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR: Device Selection */}
                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-indigo-50/50 p-4 rounded-4xl border border-indigo-100 mb-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <Info size={14} />
                                <span className="text-[10px] font-black uppercase">Baseline Node</span>
                            </div>
                            <p className="text-xs font-bold text-indigo-900">{baselineId || 'None Selected'}</p>
                        </div>

                        {devicesList.map((dev) => {
                            const isSelected = selectedDevices.includes(dev.serialNo);
                            const isBaseline = baselineId === dev.serialNo;
                            return (
                                <div key={dev.serialNo} className="relative group">
                                    <button
                                        onClick={() => toggleDevice(dev.serialNo)}
                                        className={`w-full flex items-center justify-between p-5 rounded-4xl border transition-all ${isSelected ? 'bg-gray-900 border-transparent shadow-xl' : 'bg-white border-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-2xl ${isBaseline ? 'bg-amber-500 text-white' :
                                                isSelected ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                {isBaseline ? <Anchor size={18} /> : <Cpu size={18} />}
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-900'}`}>{dev.serialNo}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{dev.location}</p>
                                            </div>
                                        </div>
                                        {isSelected ? <CheckCircle2 size={18} className="text-indigo-400" /> : <Circle size={18} className="text-gray-100" />}
                                    </button>

                                    <AnimatePresence >
                                        {isSelected && !isBaseline && (
                                            <motion.button
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBaselineId(dev.serialNo);
                                                }}
                                                className="absolute -right-2 -top-2 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase z-10 border-2 border-white"
                                            >
                                                Set Baseline
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* MAIN ANALYTICS HUB */}
                    <div className="flex-1 bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-6 mb-12">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                                <AnimatePresence mode="popLayout">
                                    {dynamicParams.map(p => (
                                        <motion.button
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            key={p}
                                            onClick={() => setActiveParam(p)}
                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all text-center truncate ${activeParam === p
                                                ? 'bg-indigo-600 border-transparent text-white shadow-lg'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'
                                                }`}
                                        >
                                            {p.replace(/([a-z])([0-9])/g, '$1 $2').toUpperCase()}
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsDeltaMode(!isDeltaMode)}
                                    className={`flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all border ${isDeltaMode
                                        ? 'bg-amber-500 border-transparent text-white shadow-xl scale-105'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-amber-200'
                                        }`}
                                >
                                    <Zap size={14} fill={isDeltaMode ? "white" : "none"} />
                                    <span className="whitespace-nowrap">
                                        {isDeltaMode ? 'Divergence View' : 'Absolute View'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="h-112.5 w-full">
                            <div className={`${isMobile ? 'h-72' : 'h-112.5'} w-full`}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={isDeltaMode ? divergenceData : processedData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: isMobile ? -30 : -18,
                                            bottom: 0
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />

                                        <XAxis
                                            dataKey="timestamp"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#CBD5E1', fontWeight: 800 }}
                                            interval={isMobile ? "preserveStartEnd" : (intervalMap[selectedDays] ?? 2)}
                                            minTickGap={isMobile ? 30 : 0}
                                            padding={{ left: 20, right: 20 }}
                                        />

                                        <YAxis
                                            domain={isDeltaMode ? ['dataMin - 5', 'dataMax + 5'] : ['auto', 'auto']}
                                            axisLine={false}
                                            tickLine={false}
                                            hide={isMobile && window.innerWidth < 400}
                                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                            tickFormatter={(value) => `${value}${getUnit(activeParam)}`}
                                            width={60}
                                        />

                                        <Tooltip
                                            content={<PrecisionTooltip
                                                isDelta={isDeltaMode}
                                                unit={getUnit(activeParam)}
                                                baselineId={baselineId}
                                                devicesList={devicesList}
                                            />}
                                        />

                                        {isDeltaMode && (
                                            <ReferenceLine
                                                y={0}
                                                stroke="#94a3b8"
                                                strokeWidth={2}
                                                strokeDasharray="3 3"
                                                label={!isMobile ? { position: 'right', value: 'BASELINE', fill: '#94a3b8', fontSize: 10, fontWeight: 900 } : undefined}
                                            />
                                        )}

                                        {selectedDevices.map((serialNo) => {
                                            const device = devicesList.find(d => d.serialNo === serialNo);
                                            return (
                                                <Area
                                                    key={serialNo}
                                                    type="monotone"
                                                    dataKey={serialNo}
                                                    stroke={isDeltaMode && serialNo === baselineId ? 'transparent' : (device?.color || '#6366f1')}
                                                    strokeWidth={isMobile ? 2 : 4}
                                                    fill={isDeltaMode && serialNo !== baselineId ? 'url(#colorPos)' : 'transparent'}
                                                    fillOpacity={1}
                                                    activeDot={{ r: isMobile ? 4 : 6, strokeWidth: 0 }}
                                                />
                                            );
                                        })}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddDeviceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                loading={isLoading}
            />
        </div>
    );
};

export default MultiDeviceSyncHub;