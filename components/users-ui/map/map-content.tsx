"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { Skeleton } from "@/components/ui/skeleton";

const MapContainer = dynamic(
    () => import("react-leaflet").then((m) => m.MapContainer),
    { ssr: false }
)

const TileLayer = dynamic(
    () => import("react-leaflet").then((m) => m.TileLayer),
    { ssr: false }
)

const Marker = dynamic(
    () => import("react-leaflet").then((m) => m.Marker),
    { ssr: false }
)

const Tooltip = dynamic(
    () => import("react-leaflet").then((m) => m.Tooltip),
    { ssr: false }
)




const aqiIcon = (value: number) =>
    L.divIcon({
        className: "bg-transparent",
        html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-10 w-10 rounded-full ${getAQIBgColor(
            value
        )} opacity-60 animate-ping"></span>
        <span class="relative inline-flex items-center justify-center px-2 py-2 rounded-full ${getAQIBgColor(
            value
        )} text-white text-sm font-bold shadow-md">
          ${value}
        </span>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });


export default function MapContent() {


    const { data: allDevices = [], isLoading } = useQuery({
        queryKey: ["user-devices-list-map"],
        queryFn: async () => {
            const res = await http.get("/api/user/map");
            return res.data;
        },
    });

    if (isLoading) {
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow">
            <Skeleton className="w-full h-full" />
        </div>
    }


    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow">

            <MapContainer
                center={[20.59, 78.96]}
                zoom={5}
                scrollWheelZoom={true}
                dragging={true}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {allDevices.map((station: {
                    id: string,
                    name: string,
                    lat: number,
                    lng: number,
                    aqi: number
                }) => (
                    <Marker
                        key={station.id}
                        position={[Number(station.lat), Number(station.lng)]}
                        icon={aqiIcon(station.aqi)}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={1}
                            sticky
                        >
                            <div className="text-sm">
                                <strong>{station.name}</strong>
                                <br />
                                AQI: <b>{station.aqi}</b>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>


        </div>

    )
}
