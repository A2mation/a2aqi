'use client'

import axios from 'axios'
import { use, useEffect, useState } from 'react'

import { http } from '@/lib/http'
import { UniversalAQIDashboard } from '@/components/aqi-ui/universal-aqi-dashboard'

interface AQIData {
    averages: {
        aqi: number | null
        pm10: number | null
        pm25: number | null
        temperature: number | null
        humidity: number | null
        country: string
    }
}

const CountryPage = ({
    params,
}: {
    params: Promise<{ country: string }>
}) => {
    const { country } = use(params)

    const [data, setData] = useState<AQIData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        async function fetchCountryData() {
            setLoading(true)
            setError(null)

            try {
                const res = await http.get<AQIData>('/api/aqi/country', {
                    params: { country },
                })

                if (res.status === 404) {
                    setError('No data available for today')
                    return;
                } else if (res.status === 500) {
                    setError('Server error. Please try again later.')
                    return;
                } 

                if (isMounted) {
                    setData(res.data)
                }

            } catch (err) {
                if (!isMounted) return

                if (axios.isAxiosError(err)) {
                    const status = err.response?.status

                    if (status === 404) {
                        setError('No data available for today')
                    } else if (status === 500) {
                        setError('Server error. Please try again later.')
                    } else {
                        setError('Failed to fetch AQI data')
                    }
                } else {
                    setError('Unexpected error occurred')
                }

            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchCountryData()

        return () => {
            isMounted = false
        }
    }, [country])

    console.log(data)

    if (loading) {
        return (
            <section className="relative w-full flex justify-center py-20">
                <p className="text-muted-foreground text-lg">
                    Loading AQI data…
                </p>
            </section>
        )
    }

    if (error) {
        return (
            <section className="relative w-full flex justify-center py-20">
                <p className="text-red-600 text-lg font-medium">
                    {error}
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
