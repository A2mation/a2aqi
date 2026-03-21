'use client'

import React, { useEffect, useMemo, useState } from 'react';


import AdvancedDeviceChart from './components/AdvancedDeviceChart';
import Header from './components/Header';
import StatHighlight from './components/StatHighlight';
import LocationStats from './components/LocationStats';
import CustomDays from './components/CustomDays';

const generateHourlyData = () => {
    return Array.from({ length: 24 }).map((_, i) => ({
        hourStart: `${i}:00`,
        avgAqi: Math.floor(Math.random() * (60 - 30) + 30),
        pm25: Math.floor(Math.random() * (20 - 5) + 5),
        pm10: Math.floor(Math.random() * (20 - 5) + 6),
        temp: Math.floor(Math.random() * (28 - 22) + 22),
        humidity: Math.floor(Math.random() * (60 - 40) + 40),
        co2: Math.floor(Math.random() * (60 - 40) + 0.5),
    }));
};



const MonitorDeviceAnalyticsPage: React.FC = () => {
    const hourlyData = useMemo(() => generateHourlyData(), []);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])


    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FBFBFE] p-4 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <Header />


                <StatHighlight />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Line Chart - Pollution Trends */}
                    <AdvancedDeviceChart hourlyData={hourlyData} />

                    <LocationStats />

                </div>

                <CustomDays />

            </div>
        </div>
    );
};

export default MonitorDeviceAnalyticsPage;