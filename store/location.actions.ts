"use client"

import { http } from "@/lib/http"
import { useLocationStore } from "./location.store"
import { logLocationError } from "@/helpers/log-location"
import toast from "react-hot-toast"

// Primary + fallback endpoints
const IP_APIS = [
    "/api/location",                 // your backend
    "https://ipapi.co/json/",         // fallback public API
]

export const detectIpLocation = async () => {
    const setState = useLocationStore.getState().setState
    setState({ loading: true, error: undefined })

    for (const url of IP_APIS) {
        try {
            const { data } = await http.get(url)

            const lat = data.lat || data.latitude
            const lng = data.lng || data.longitude


            if (lat && lng) {
                setState({
                    lat,
                    lng,
                    location: data.location,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pm10: data.pm10,
                    pm25: data.pm25,
                    aqi: data.aqi,
                    no2: data.no2,
                    o3: data.o3,
                    temp: data.temp,
                    humidity: data.humidity,
                    wind: data.wind,
                    co: data.co,
                    so2: data.so2,
                    source: data.source || "ip",
                    loading: false,
                    lastUpdated: new Date(),
                })
                return
            }
        } catch (error) {
            logLocationError(url, error);
            setState({ error: `Failed to fetch ip from ${url}` })
        }
    }
}



export const detectGpsLocation = () => {
    const { setState, loading } = useLocationStore.getState()

    if (loading) return Promise.resolve()

    setState({ loading: true, error: undefined })

    return new Promise<void>((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            setState({ error: "Geolocation not supported", loading: false })
            toast.error("Geolocation is not supported by your browser.")
            reject("Geolocation not supported")
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                console.log(`GPS location obtained:${pos.coords}`)
                try {
                    const lat = pos.coords.latitude
                    const lng = pos.coords.longitude

                    const { data } = await http.get("/api/location", {
                        params: { lat, lng },
                    })

                    setState({
                        lat,
                        lng,
                        location: data.location,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                        pm10: data.pm10,
                        pm25: data.pm25,
                        aqi: data.aqi,
                        no2: data.no2,
                        o3: data.o3,
                        temp: data.temp,
                        humidity: data.humidity,
                        wind: data.wind,
                        co: data.co,
                        so2: data.so2,
                        source: "gps",
                        loading: false,
                        lastUpdated: new Date(),
                    })

                    resolve()
                } catch (error) {
                    setState({ error: "Backend fetch failed", loading: false })
                    toast.error("Failed to fetch location data from backend.")
                    reject(error)
                } finally {
                    setState({ loading: false })
                }
            },
            (err) => {
                setState({ error: err.message, loading: false })
                setState({ loading: false })
                toast.error(`Please allow location access.`)
                reject(err)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
            }
        )
    })
}


