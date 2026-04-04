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
    const setState = useLocationStore.getState().setState;

    setState({ loading: true, error: undefined });

    for (const url of IP_APIS) {
        try {
            const { data } = await http.get(url);

            const { nearest, popularCities, nearbyCities, graphData } = data;
            console.log(data)

            if (nearest) {
                const lat = nearest.lat || nearest.latitude;
                const lng = nearest.lng || nearest.longitude;

                setState({
                    lat,
                    lng,
                    location: nearest.location,
                    city: nearest.city,
                    state: nearest.state,
                    country: nearest.country,
                    pm10: nearest.pm10,
                    pm25: nearest.pm25,
                    aqi: nearest.aqi,
                    no2: nearest.no2,
                    o3: nearest.o3,
                    temp: nearest.temperature || nearest.temp,
                    humidity: nearest.humidity,
                    wind: nearest.wind,
                    co: nearest.co,
                    so2: nearest.so2,
                    source: nearest.source || "CPCB",

                    // Update the collection fields
                    popularCities: popularCities || [],
                    nearbyCities: nearbyCities || [],
                    graphData: graphData || [],

                    loading: false,
                    lastUpdated: new Date(),
                });

                return;
            } else {
                setState({ loading: false, error: "No location data found" });
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
                // console.log(`GPS location obtained:${pos.coords}`)
                try {
                    const lat = pos.coords.latitude
                    const lng = pos.coords.longitude

                    const response = await http.get("/api/location", {
                        params: { lat, lng },
                    })

                    const { nearest, popularCities, nearbyCities, graphData } = response.data;

                    const actualLocation = await http.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    )

                    if (nearest) {
                        setState({
                            lat,
                            lng,
                            location: actualLocation.data.display_name || nearest.location,

                            city: nearest.city,
                            state: nearest.state,
                            country: nearest.country,
                            pm10: nearest.pm10,
                            pm25: nearest.pm25,
                            aqi: nearest.aqi,
                            no2: nearest.no2,
                            o3: nearest.o3,
                            temp: nearest.temperature || nearest.temp,
                            humidity: nearest.humidity,
                            wind: nearest.wind,
                            co: nearest.co,
                            so2: nearest.so2,
                            source: nearest.source || "CPCB",

                            popularCities: popularCities || [],
                            nearbyCities: nearbyCities || [],
                            graphData: graphData || [],

                            loading: false,
                            lastUpdated: new Date(),
                        })
                    }

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


