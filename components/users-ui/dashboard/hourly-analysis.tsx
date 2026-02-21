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

export function HourlyAnalysis() {
    const { deviceId } = useParams();

    const [isClient, setIsClient] = useState(false);

    // Example device register date (later from backend)
    const deviceRegisterDate = new Date(2026, 1, 16);
    deviceRegisterDate.setHours(0, 0, 0, 0);

    const [startDate, setStartDate] = useState(deviceRegisterDate);
    const [endDate, setEndDate] = useState(addDays(deviceRegisterDate, 6));

    const [dateOpen, setDateOpen] = useState(false);

    // default month = register month
    const [calendarMonth, setCalendarMonth] = useState(
        new Date(deviceRegisterDate.getFullYear(), deviceRegisterDate.getMonth(), 1)
    );

    // Fetch Heatmap Data from Backend
    const { data, isPending, error } = useQuery({
        queryKey: ['hourlyHeatmap', deviceId, formatBackendDate(startDate)],
        queryFn: async () => {
            const res = await http.get(
                `/api/user/dashboard/hourly-time-slot?deviceId=${deviceId}&startDate=${formatBackendDate(
                    startDate
                )}`
            );
            return res.data;
        },
        enabled: !!deviceId,
    });

    // Min and max range for calendar
    const minDate = data?.data?.startDate
        ? new Date(data.data.startDate)
        : deviceRegisterDate;

    const maxDate = data?.data?.endDate
        ? new Date(data.data.endDate)
        : new Date();

    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

    const heatmapData = data?.data?.heatmap ?? [];

    const dates = heatmapData.map((item: any) =>
        new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    );

    // Convert backend data into easy lookup
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

    // Max value for color scaling
    const allValues = Object.values(matrix).flatMap((day) =>
        Object.values(day).filter((v) => v !== null)
    ) as number[];

    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 500;

    const daysInMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const firstDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDateSelect = (day: number) => {
        const selected = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );

        selected.setHours(0, 0, 0, 0);

        // block before minDate or after maxDate
        if (selected < minDate) return;
        if (selected > maxDate) return;

        setStartDate(selected);

        // backend always gives 7 days, so UI uses +6
        setEndDate(addDays(selected, 6));
    };

    const isDateInRange = (day: number) => {
        const date = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );
        return date >= startDate && date <= endDate;
    };

    const isStartDate = (day: number) => {
        const date = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );
        return (
            startDate.getFullYear() === date.getFullYear() &&
            startDate.getMonth() === date.getMonth() &&
            startDate.getDate() === date.getDate()
        );
    };

    const isEndDate = (day: number) => {
        const date = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            day
        );
        return (
            endDate.getFullYear() === date.getFullYear() &&
            endDate.getMonth() === date.getMonth() &&
            endDate.getDate() === date.getDate()
        );
    };

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const isPrevDisabled =
        calendarMonth.getFullYear() === minMonth.getFullYear() &&
        calendarMonth.getMonth() === minMonth.getMonth();

    const isNextDisabled =
        calendarMonth.getFullYear() === maxMonth.getFullYear() &&
        calendarMonth.getMonth() === maxMonth.getMonth();

    const renderCalendar = () => {
        const days = [];
        const totalCells =
            firstDayOfMonth(calendarMonth) + daysInMonth(calendarMonth);

        for (let i = 0; i < totalCells; i++) {
            if (i < firstDayOfMonth(calendarMonth)) {
                days.push(<div key={`empty-${i}`} className="h-10" />);
            } else {
                const day = i - firstDayOfMonth(calendarMonth) + 1;

                const currentDate = new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth(),
                    day
                );

                currentDate.setHours(0, 0, 0, 0);

                // hide before minDate
                if (currentDate < minDate) {
                    days.push(<div key={`hidden-${day}`} className="h-10 w-10" />);
                    continue;
                }

                // hide after maxDate
                if (currentDate > maxDate) {
                    days.push(<div key={`hidden-max-${day}`} className="h-10 w-10" />);
                    continue;
                }

                const inRange = isDateInRange(day);
                const isStart = isStartDate(day);
                const isEnd = isEndDate(day);

                days.push(
                    <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className={`h-10 w-10 rounded text-sm font-medium transition-colors
              ${isStart || isEnd
                                ? 'bg-gray-900 text-white'
                                : inRange
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }
            `}
                    >
                        {day}
                    </button>
                );
            }
        }

        return days;
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="w-full mx-auto p-6 rounded-2xl bg-white transition-all duration-500 hover:shadow-xl animate-slide-in-up">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Hourly Insights</h1>

                <Popover
                    open={dateOpen}
                    onOpenChange={(open) => {
                        setDateOpen(open);

                        if (open) {
                            setCalendarMonth(
                                new Date(startDate.getFullYear(), startDate.getMonth(), 1)
                            );
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDateLabel(startDate)} - {formatDateLabel(endDate)}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-4" align="end">
                        <div className="space-y-4 w-60 md:w-80">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-3">
                                    Select Start Date
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={isPrevDisabled}
                                    onClick={() => {
                                        if (!isPrevDisabled) {
                                            setCalendarMonth(
                                                new Date(
                                                    calendarMonth.getFullYear(),
                                                    calendarMonth.getMonth() - 1
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                <div className="text-center">
                                    <div className="font-medium">
                                        {monthNames[calendarMonth.getMonth()]}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {calendarMonth.getFullYear()}
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={isNextDisabled}
                                    onClick={() => {
                                        if (!isNextDisabled) {
                                            setCalendarMonth(
                                                new Date(
                                                    calendarMonth.getFullYear(),
                                                    calendarMonth.getMonth() + 1
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs font-medium text-gray-600 h-6 flex items-center justify-center"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                            <Button
                                onClick={() => setDateOpen(false)}
                                className="w-full bg-gray-900 hover:bg-gray-800"
                            >
                                Close
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {isPending ? (
                <ChartLoader />
            ) : error ? (
                <p className="text-sm text-red-500">Failed to load data</p>
            ) : (
                <div>
                    {/* Heatmap */}
                    <div className="border border-gray-200 rounded-lg bg-background p-3 w-full">
                        <div
                            className="grid gap-1 w-full"
                            style={{
                                gridTemplateColumns: `clamp(60px, 16vw, 90px) repeat(${dates.length}, 1fr)`,
                            }}
                        >
                            <div></div>

                            {dates.map((date: any) => (
                                <div
                                    key={date}
                                    className="text-center text-[8px] sm:text-base font-medium text-gray-600 truncate"
                                >
                                    {date}
                                </div>
                            ))}

                            {TIME_SLOTS.map((slot) => (
                                <React.Fragment key={slot.startHour}>
                                    <div className="text-right text-[10px] sm:text-base font-medium text-gray-700 pr-1 flex items-center justify-center">
                                        {slot.label}
                                    </div>

                                    {dates.map((date: any) => {
                                        const value = matrix?.[date]?.[slot.label] ?? null;

                                        const color = value ? getAQIColor(value) : '#f3f4f6';

                                        return (
                                            <HoverCard key={`${date}-${slot.label}`}>
                                                <HoverCardTrigger asChild>
                                                    <div
                                                        className="rounded-sm cursor-pointer"
                                                        style={{
                                                            backgroundColor: color,
                                                            height: 'clamp(16px, 3vw, 26px)',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </HoverCardTrigger>

                                                <HoverCardContent className="w-52 text-sm">
                                                    <p className="font-semibold text-gray-900">
                                                        Date : {date}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Time : {slot.label}
                                                    </p>
                                                    <p className="mt-2 font-bold text-gray-900">
                                                        AQI:{' '}
                                                        <span className={cn(getAQITextColor(value ?? 0))}>
                                                            {value ?? 'No Data'}
                                                        </span>
                                                    </p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Min/Max Cards */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-yellow-50 border-yellow-200">
                            <div className="text-sm text-gray-600">Min AQI</div>
                            <div className="mt-2 text-xl font-bold">
                                {allValues.length > 0 ? Math.min(...allValues) : '-'}
                            </div>
                        </Card>

                        <Card className="p-4 bg-red-50 border-red-200 text-right">
                            <div className="text-sm text-gray-600">Max AQI</div>
                            <div className="mt-2 text-xl font-bold">
                                {allValues.length > 0 ? maxValue : '-'}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
