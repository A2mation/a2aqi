"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMap, useMapEvents } from "react-leaflet";

import { http } from "@/lib/http";


import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import { AirQualityCard } from "./Aqi-Card";
import StationMonitor from "./SearchBar";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });

export type StationData = {
    id: string;
    lat: number;
    lng: number;
    aqi: number;
    temperature: number;
}

function ZoomHandler({ onZoom }: { onZoom: (zoom: number) => void }) {
    const map = useMapEvents({
        zoom: () => onZoom(map.getZoom()),
    });
    return null;
}


const createAqiIcon = (value: number, zoom: number) => {
    const bgColor = getAQIBgColor(value);

    const showText = zoom >= 8;

    // Sizing logic: 
    // Zoom < 10: tiny dots 
    // Zoom >= 10: larger circles 
    const size = zoom < 8
        ? Math.max(zoom * 1.1, 6)
        : Math.min(zoom * 3.5, 45);

    const blurAmount = zoom < 10 ? "blur-[3px]" : "blur-[2px]";
    const blurOpacity = zoom < 10 ? "opacity-60" : "opacity-40";

    return L.divIcon({
        className: "bg-transparent",
        html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
        <div class="absolute inset-0 rounded-full ${bgColor} ${blurOpacity} ${blurAmount} transform scale-150"></div>
        
        <div class="relative flex items-center justify-center rounded-full ${bgColor} text-white font-black shadow-md border border-white/30"
             style="width: 100%; height: 100%; font-size: ${size * 0.45}px; opacity: 0.95;">
          ${showText ? Math.round(value) : ""}
        </div>
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

export default function Map() {
    const [zoom, setZoom] = useState(11);
    const [selectedStation, setSelectedStation] = useState<StationData | null>(null); // Start as null
    const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);

    const defaultStation: StationData = {
        id: '69e17a4ffe30c98afc221a06',
        lat: 19.1553,
        lng: 72.9438,
        aqi: 0,
        temperature: 0
    };

    useEffect(() => {
        const isDesktop = window.innerWidth >= 1050;
        if (isDesktop) {
            setSelectedStation(defaultStation);
        }
    }, []);

    const { data: markers = [], isPending, isFetching } = useQuery({
        queryKey: ["map-aqi-data"],
        queryFn: async () => {
            const res = await http.get("/api/maps/aqi");
            return res.data;
        },
        staleTime: 30000,
    });



    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow">

            {
                markers && <>
                    <MapContainer
                        center={[19.1553, 72.9438]} // Mumbai Focused
                        zoom={zoom}
                        scrollWheelZoom={true}
                        className="h-full w-full z-0"
                    >
                        <ZoomHandler onZoom={setZoom} />

                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />

                        {markers?.map((station: StationData) => (
                            (station.lat && station.lng) &&
                            <Marker
                                key={`${station.id}-${zoom}`}
                                position={[station.lat, station.lng]}
                                icon={createAqiIcon(
                                    station.aqi,
                                    zoom
                                )}
                                eventHandlers={{ click: () => setSelectedStation(station) }}
                            />
                        ))}
                        <MapFlyController center={targetCoords} />
                    </MapContainer>
                </>
            }

            {/* Overlays */}
            <div className="absolute top-5 right-0 z-40 w-full max-w-80 md:max-w-150 px-4">
                <StationMonitor data={markers} setSelectedStation={setSelectedStation} />
            </div>

            {
                selectedStation && <>
                    <div className="fixed inset-x-0 bottom-0 z-10 h-[45vh] md:h-auto md:absolute md:top-10 md:left-6 md:w-95 md:bottom-auto">
                        <AirQualityCard station={selectedStation} onCloseAction={() => setSelectedStation(null)} />
                    </div>
                </>
            }

            {(isPending || (isFetching && markers.length === 0)) && (
                <div className="absolute inset-0 z-1001 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
}

function MapFlyController({ center }: { center: [number, number] | null }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, 12, {
                duration: 3,
                easeLinearity: 0.25,
            });
        }
    }, [center, map]);

    return null;
}