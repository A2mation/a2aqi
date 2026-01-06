"use client"

import { http } from "@/lib/http"
import { useLocationStore } from "./location.store"
import { logLocationError } from "@/helpers/log-location"

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
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    source: "ip",
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
    const setState = useLocationStore.getState().setState

    setState({ loading: true, error: undefined })

    if (!("geolocation" in navigator)) {
        setState({ error: "Geolocation not supported", loading: false })
        return
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            setState({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                source: "gps",
                loading: false,
                lastUpdated: new Date(), 
            })
        },
        (err) => {
            setState({
                error: err.message,
                loading: false,
                lastUpdated: new Date(), 
            })
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
        }
    )

}
