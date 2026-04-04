"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, LineChart as LineIcon, Activity, ChartNoAxesColumn, Thermometer, Wind, MapPin } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Area, AreaChart } from "recharts"

import { Card } from "@/components/ui/card"
import { getAQIColor } from "@/helpers/aqi-color-pallet"
import { GraphData, useLocationStore } from "@/store/location.store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const formatChartDate = (date: Date) => ({
    date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    fullDate: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
});

const getHistogramData = (rawData: GraphData[]) => {
    const buckets = [
        { range: "0-50", label: "Good", count: 0, color: "#10b981" },
        { range: "51-100", label: "Moderate", count: 0, color: "#f59e0b" },
        { range: "101-150", label: "Unhealthy (S)", count: 0, color: "#f97316" },
        { range: "151-200", label: "Unhealthy", count: 0, color: "#ef4444" },
        { range: "201+", label: "Very Unhealthy", count: 0, color: "#7c3aed" },
    ];

    rawData.forEach(d => {
        if (d.aqi <= 50) buckets[0].count++;
        else if (d.aqi <= 100) buckets[1].count++;
        else if (d.aqi <= 150) buckets[2].count++;
        else if (d.aqi <= 200) buckets[3].count++;
        else buckets[4].count++;
    });
    return buckets;
};

const CustomTooltip = ({ active, payload, dataType, chartType }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isHistogram = chartType === 'histogram';
        const value = payload[0].value;

        return (
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-xl ring-1 ring-black/5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                    {isHistogram ? `Range: ${data.range}` : formatChartDate(data.createdAt).fullDate}
                </p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: isHistogram
                                    ? data.color
                                    : (dataType === 'aqi' ? getAQIColor(value) : '#f97316')
                            }}
                        />
                        <p className="text-sm font-semibold text-slate-900">
                            {isHistogram ? `Days: ${value}` : `${dataType === 'aqi' ? 'AQI' : 'Temp'}: ${value}${dataType === 'temperature' ? '°C' : ''}`}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function AQIGraph() {
    const {
        graphData: weekGraphData,
        loading: storeLoading,
        location,
        state,
    } = useLocationStore();
    const [isMounted, setIsMounted] = useState(false);
    const [chartType, setChartType] = useState<"bar" | "line" | "histogram">("bar");
    const [dataType, setDataType] = useState<"aqi" | "temperature">("aqi");

    const activeData = useMemo(() => weekGraphData || [], [weekGraphData]);
    const histogramData = useMemo(() => getHistogramData(activeData), [activeData]);

    const stats = useMemo(() => {
        if (activeData.length === 0) return { min: 0, max: 0, minDate: '-', maxDate: '-', avgTemp: 0 };
        const values = activeData.map(d => d.aqi);
        const temps = activeData.filter(d => d.temperature !== null).map(d => d.temperature as number);

        return {
            min: Math.min(...values),
            max: Math.max(...values),
            minDate: formatChartDate(activeData.find(d => d.aqi === Math.min(...values))?.createdAt || new Date()).date,
            maxDate: formatChartDate(activeData.find(d => d.aqi === Math.max(...values))?.createdAt || new Date()).date,
            avgTemp: temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : null
        };
    }, [activeData]);

    useEffect(() => { setIsMounted(true) }, []);

    if (!isMounted || storeLoading) {
        return <div className="w-full h-screen flex items-center justify-center text-slate-400 font-medium italic">Loading metrics...</div>;
    }

    const primaryColor = dataType === "aqi" ? "#2563eb" : "#f97316";

    return (
        <div className="w-full max-w-7xl my-10 md:mb-5 mx-auto p-4 md:p-8 space-y-8 min-h-fit">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                        <Activity className="w-3 h-3 mr-2 animate-pulse" /> Analytics Dashboard
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                        Historical <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 italic">Air Quality</span>
                    </h1>

                    {(location || state) && (
                        <div className="inline-flex items-center text-slate-500 font-medium text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{location?.split(',')[0] || 'LOCAL'}{state ? `, ${state}` : ""}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
                    {/* Select 1: Data Type */}
                    <Select value={dataType} onValueChange={(val: any) => setDataType(val)}>
                        <SelectTrigger className="w-44 border-none focus:ring-0 font-bold text-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="aqi">
                                <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-blue-500" /> Air Quality (AQI)</div>
                            </SelectItem>
                            <SelectItem value="temperature">
                                <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-orange-500" /> Temperature</div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="hidden md:block w-px h-6 bg-slate-200" />

                    {/* Select 2: Chart Visual Type */}
                    <Select value={chartType} onValueChange={(val: any) => setChartType(val)}>
                        <SelectTrigger className="w-44 border-none focus:ring-0 font-bold text-slate-700">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bar"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Bar Chart</div></SelectItem>
                            <SelectItem value="line"><div className="flex items-center gap-2"><LineIcon className="w-4 h-4" /> Line Graph</div></SelectItem>
                            {dataType === 'aqi' && (
                                <SelectItem value="histogram"><div className="flex items-center gap-2"><ChartNoAxesColumn className="w-4 h-4" /> Histogram</div></SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-4xl p-6 md:p-10">
                <div className="h-100 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "line" ? (
                            <AreaChart data={activeData} margin={{ left: -20 }}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={primaryColor} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="createdAt"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => formatChartDate(val).date}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip dataType={dataType} chartType="line" />} />
                                <Area type="monotone" dataKey={dataType} stroke={primaryColor} strokeWidth={4} fillOpacity={1} fill="url(#colorGradient)" />
                            </AreaChart>
                        ) : chartType === "histogram" && dataType === "aqi" ? (
                            <BarChart data={histogramData} margin={{ left: -20 }}>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip dataType={dataType} chartType="histogram" />} />
                                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
                                    {histogramData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        ) : (
                            <BarChart data={activeData} margin={{ left: -20 }} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="createdAt"
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => formatChartDate(val).date}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip dataType={dataType} chartType="bar" />} />
                                <Bar dataKey={dataType} radius={[6, 6, 0, 0]}>
                                    {activeData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={dataType === 'aqi' ? getAQIColor(entry.aqi) : '#f97316'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}