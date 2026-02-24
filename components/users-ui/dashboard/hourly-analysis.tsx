'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { http } from '@/lib/http';
import { TIME_SLOTS } from '@/utils/timeSlots';
import { cn } from '@/lib/utils';
import { getAQIColor, getAQITextColor } from '@/helpers/aqi-color-pallet';
import ChartLoader from '@/components/ui/chart-loading';

const formatDateLabel = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatBackendDate = (date: Date) => date.toISOString().split('T')[0];

const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const minusDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
};

export function HourlyAnalysis({ currentDeviceAssignDate }: {
    currentDeviceAssignDate: Date | null
}) {
    const { deviceId } = useParams();
    const [isClient, setIsClient] = useState(false);


    const minDate = useMemo(() => {
        const d = currentDeviceAssignDate ? new Date(currentDeviceAssignDate) : new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, [currentDeviceAssignDate]);

    const maxDate = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    
    const [selectionDate, setSelectionDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [dateOpen, setDateOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        setSelectionDate(now);
        setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    }, []);

    
    const startDate = useMemo(() => minusDays(selectionDate, 6), [selectionDate]);
    const endDate = selectionDate;

   
    const { data, isPending, error } = useQuery({
        queryKey: ['hourlyHeatmap', deviceId, formatBackendDate(startDate)],
        queryFn: async () => {
            const res = await http.get(
                `/api/user/dashboard/hourly-time-slot?deviceId=${deviceId}&startDate=${formatBackendDate(addDays(startDate, 1))}`
            );
            return res.data;
        },
        enabled: !!deviceId && isClient,
    });

    const heatmapData = data?.data?.heatmap ?? [];
    const matrix = useMemo(() => {
        const map: Record<string, Record<string, number | null>> = {};
        heatmapData.forEach((day: any) => {
            const labelDate = new Date(day.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            map[labelDate] = {};
            day.slots.forEach((slot: any) => {
                map[labelDate][slot.time] = slot.aqi;
            });
        });
        return map;
    }, [heatmapData]);

    
    const dates = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            return addDays(startDate, i).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        });
    }, [startDate]);

    const allValues = Object.values(matrix).flatMap((day) =>
        Object.values(day).filter((v) => v !== null)
    ) as number[];

    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

   
    const handleDateSelect = (day: number) => {
        const selected = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );
        selected.setHours(0, 0, 0, 0);
        setSelectionDate(selected);
    };

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const renderCalendar = () => {
        const days = [];
        const totalCells = firstDayOfMonth(calendarMonth) + daysInMonth(calendarMonth);

        for (let i = 0; i < totalCells; i++) {
            if (i < firstDayOfMonth(calendarMonth)) {
                days.push(<div key={`empty-${i}`} className="h-10" />);
            } else {
                const day = i - firstDayOfMonth(calendarMonth) + 1;
                const currentDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                currentDate.setHours(0, 0, 0, 0);

                const isEnd = endDate.getTime() === currentDate.getTime();
                const isStart = startDate.getTime() === currentDate.getTime();
                const inRange = currentDate > startDate && currentDate < endDate;
                const isDisabled = currentDate < minDate || currentDate > maxDate;

                days.push(
                    <button
                        key={day}
                        disabled={isDisabled}
                        onClick={() => handleDateSelect(day)}
                        className={cn(
                            "h-10 w-10 text-sm font-medium transition-colors relative flex items-center justify-center",
                            // Start and End (18 and 24) are both Dark
                            (isStart || isEnd) && "bg-slate-900 text-white rounded-md z-10",
                            // Middle days are Light Gray
                            inRange && "bg-slate-100 text-slate-900 rounded-none",
                            !inRange && !isStart && !isEnd && !isDisabled && "hover:bg-gray-100 text-gray-700 rounded-md",
                            isDisabled && "opacity-20 cursor-not-allowed"
                        )}
                    >
                        {day}
                    </button>
                );
            }
        }
        return days;
    };

    if (!isClient) return null;

    return (
        <div className="w-full mx-auto p-6 rounded-2xl bg-white border shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Hourly Insights</h1>

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDateLabel(startDate)} - {formatDateLabel(endDate)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="outline" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="text-center font-medium">
                                {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-400">
                            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                    </PopoverContent>
                </Popover>
            </div>

            {isPending ? (
                <ChartLoader />
            ) : error ? (
                <p className="text-sm text-red-500">Failed to load data</p>
            ) : (
                <div className="space-y-6">
                    <div className="border border-gray-100 rounded-xl p-2 sm:p-4">
                        <div
                            className="grid gap-1 w-full"
                            style={{
                                gridTemplateColumns: `clamp(60px, 16vw, 90px) repeat(${dates.length}, 1fr)`,
                            }}
                        >
                            <div />
                            {dates.map(date => (
                                <div key={date} className="text-center text-[8px] sm:text-base font-semibold text-gray-500 pb-2">
                                    {date}
                                </div>
                            ))}

                            {TIME_SLOTS.map((slot) => (
                                <React.Fragment key={slot.startHour}>
                                    <div className="text-right text-[10px] sm:text-base font-medium text-gray-400 pr-3 flex items-center justify-end">
                                        {slot.label}
                                    </div>
                                    {dates.map((date) => {
                                        const value = matrix?.[date]?.[slot.label] ?? null;
                                        const color = value ? getAQIColor(value) : '#F9FAFB';

                                        return (
                                            <HoverCard key={`${date}-${slot.label}`}>
                                                <HoverCardTrigger asChild>
                                                    <div
                                                        className="rounded-sm transition-transform hover:scale-110 cursor-pointer border border-white"
                                                        style={{
                                                            backgroundColor: color,
                                                            height: 'clamp(16px, 3vw, 26px)',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-40">
                                                    <div className="text-xs space-y-1">
                                                        <p className="font-bold">{date} • {slot.label}</p>
                                                        <p>AQI: <span className={cn("font-bold", getAQITextColor(value ?? 0))}>{value ?? 'N/A'}</span></p>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-slate-50 border-none shadow-none">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Min AQI</div>
                            <div className="text-2xl font-black text-slate-700">
                                {allValues.length > 0 ? Math.min(...allValues) : '--'}
                            </div>
                        </Card>
                        <Card className="p-4 bg-slate-50 border-none shadow-none">
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Max AQI</div>
                            <div className="text-2xl font-black text-slate-700">
                                {maxValue || '--'}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}