'use client'

import axios from 'axios'
import { use } from 'react';
import { useQuery } from "@tanstack/react-query";

import { http } from '@/lib/http'
import { UniversalAQIDashboard } from '@/components/aqi-ui/universal-aqi-dashboard'
import { UniversalAQIDashboardSkeleton } from '@/components/aqi-ui/loaders/universal-aqi-dashboard-loader'

interface AQIData {
    averages: {
        aqi: number | null
        pm10: number | null
        pm25: number | null
        temperature: number | null
        humidity: number | null
        country: string
    },
    message?: string
}

const CountryPage = ({
    params,
}: {
    params: Promise<{ country: string }>
}) => {
    const { country } = use(params)
const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['aqi', country],
        queryFn: async () => {
            try {
                const res = await http.get<AQIData>('/api/aqi/country', {
                    params: { country },
                });
                if (res.status !== 200) {
                    throw new Error(res.data.message)
                }
                return res.data;
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 404) throw new Error('No data available for today');
                    if (status === 500) throw new Error('Server error. Please try again later.');
                }
                throw new Error('Failed to fetch AQI data');
            }
        },
        enabled: !!country,
        staleTime: 1000 * 60 * 5, // 5 mins cache
        retry: 1,
    });

    if (isLoading) {
        return (
            <UniversalAQIDashboardSkeleton />
        )
    }

    if (isError) {
        return (
            <section className="relative w-full flex justify-center py-20">
                <p className="text-red-600 text-lg font-medium">
                    {error.message}
                </p>
            </section>
        )
    }

    if (!data) {
        return null
    }

    return (
        <section className="relative w-full">
            <UniversalAQIDashboard data={data} />
        </section>
    )
}

export default CountryPage
