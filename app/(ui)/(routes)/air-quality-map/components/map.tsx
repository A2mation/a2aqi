"use client";

import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Popup, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";

import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import { AirQualityCard } from "./air-quality-card";
import { AQIMarker } from "../page";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCcw } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

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
  lat,
  lng,
}: {
  lat: number | null;
  lng: number | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState<AQIMarker | null>(null);
  const [bounds, setBounds] = useState<any>(null);

  const debouncedBounds = useDebounce(bounds, 400);

  const { data: markers = [],
    isPending,
    isFetching,
    isError
  } = useQuery({
    queryKey: ["map-aqi-bounds", debouncedBounds],
    queryFn: async () => {
      const res = await axios.get("/api/maps/aqi", { params: debouncedBounds });
      return res.data;
    },
    enabled: !!debouncedBounds,

    placeholderData: (previousData) => previousData,
  });

  const showFullLoader = isPending && !!debouncedBounds;
  const showBackgroundLoader = isFetching && !isPending;

  useEffect(() => { setMounted(true); }, []);

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-4">
        <p className="text-red-600">Failed to load air quality data. Please try zooming in.</p>
      </div>
    );
  }

  if (!mounted || lat == null || lng == null) return null;

  return (
    <div className="relative min-h-screen w-full h-screen rounded-2xl overflow-hidden bg-white shadow">
      <MapContainer
        center={[lat, lng]}
        zoom={8}
        className="h-full w-full z-0"
      >
        <MapEvents onBoundsChange={setBounds} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((station: AQIMarker) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={aqiIcon(station.aqi)}
            eventHandlers={{ click: () => setSelectedStation(station) }}
          />
        ))}
      </MapContainer>

      <div className="absolute top-3/4 md:top-1/4 left-3 z-">
        <AirQualityCard station={selectedStation} />
      </div>

      {showFullLoader && (
        <div className="absolute inset-0 z- flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading AQI Data...</p>
          </div>
        </div>
      )}

      {showBackgroundLoader && (
        <div className="absolute top-4 right-4 z- flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-md border animate-in fade-in zoom-in">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-gray-600">Updating area...</span>
        </div>
      )}
    </div>
  );
}


function MapEvents({ onBoundsChange }: { onBoundsChange: (b: any) => void }) {
  const map = useMapEvents({

    moveend: () => {
      const b = map.getBounds();
      onBoundsChange({
        north: parseFloat(b.getNorth().toFixed(3)),
        south: parseFloat(b.getSouth().toFixed(3)),
        east: parseFloat(b.getEast().toFixed(3)),
        west: parseFloat(b.getWest().toFixed(3)),
      });
    },
  });


  useEffect(() => {
    if (map) {
      const b = map.getBounds();
      onBoundsChange({
        north: parseFloat(b.getNorth().toFixed(3)),
        south: parseFloat(b.getSouth().toFixed(3)),
        east: parseFloat(b.getEast().toFixed(3)),
        west: parseFloat(b.getWest().toFixed(3)),
      });
    }
  }, [map, onBoundsChange]);

  return null;
}
