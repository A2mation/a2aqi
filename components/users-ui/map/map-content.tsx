"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import dynamic from "next/dynamic";

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



export type AQIStation = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    aqi: number;
};

export const dummyStations: AQIStation[] = [
    {
        id: "1",
        name: "Downtown Monitoring Station",
        lat: 37.7749,
        lng: -122.4194,
        aqi: 42,
    },
    {
        id: "2",
        name: "Central Park AQI Station",
        lat: 37.7685,
        lng: -122.4827,
        aqi: 88,
    },
    {
        id: "3",
        name: "Industrial Zone Sensor",
        lat: 37.8044,
        lng: -122.2711,
        aqi: 155,
    },
    {
        id: "4",
        name: "Airport Air Quality Station",
        lat: 37.6213,
        lng: -122.379,
        aqi: 210,
    },
    {
        id: "5",
        name: "Suburban Green Area Sensor",
        lat: 37.6879,
        lng: -122.4702,
        aqi: 65,
    },
];
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
    const markers = dummyStations;


    return (
        // <div className="space-y-6 animate-fade-in">

            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow">

                <MapContainer
                    center={[37.7749, -122.4194]}
                    zoom={13}
                    scrollWheelZoom={true}
                    dragging={true}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markers.map((station) => (
                        <Marker
                            key={station.id}
                            position={[station.lat, station.lng]}
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
        // </div>
    )
}
