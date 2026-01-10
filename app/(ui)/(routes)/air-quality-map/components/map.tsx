"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Popup, useMapEvents } from "react-leaflet";

import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import { AirQualityCard } from "./air-quality-card";
import { AQIMarker } from "../page";
import { http } from "@/lib/http";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

export default function Map({
  markers,
  loading,
  lat,
  lng,
  setMarkers
}: {
  markers: AQIMarker[];
  loading: boolean;
  lat: number | null;
  lng: number | null;
  setMarkers: React.Dispatch<React.SetStateAction<AQIMarker[]>>;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState<AQIMarker | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);


  const handleBoundsChange = (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      
      if (requestRef.current) {
        requestRef.current.abort();
      }

      const controller = new AbortController();
      requestRef.current = controller;

      try {
        const res = await http.get("/api/maps/aqi", {
          params: bounds,
          signal: controller.signal,
        });

        setMarkers(res.data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch map AQI data", err);
        }
      }
    }, 300); 
  };


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading || lat == null || lng == null) return null;

  return (
    <div className=" w-full h-full rounded-2xl overflow-hidden bg-white shadow">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <MapEvents onBoundsChange={handleBoundsChange} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={aqiIcon(station.aqi)}
            eventHandlers={{
              click: () => setSelectedStation(station),
            }}
          >
            <Popup offset={[0, -10]}>
              <strong>{station.name}</strong>
              <br />
              AQI: <b>{station.aqi}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* CARD OVERLAY */}
      <div className="absolute top-3/4 md:top-1/4 left-8 md:left-15 z-80">
        <AirQualityCard station={selectedStation} />
      </div>
    </div>
  );
}




function MapEvents({ onBoundsChange }: { onBoundsChange: (b: any) => void }) {
  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();

      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  return null;
}
