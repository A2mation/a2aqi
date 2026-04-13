"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMap, useMapEvents } from "react-leaflet";

import { http } from "@/lib/http";
import MapSearchBar from "./map-search-bar";
import { AirQualityCard } from "./air-quality-card";
import { getAQIBgColor } from "@/helpers/aqi-color-pallet";
import { getTemperatureValue } from "@/helpers/temperature-color-pallet";


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

const aqiIcon = (value: number, parameter: string) => {
  const bgColor = parameter === 'aqi' ? getAQIBgColor(value) : getTemperatureValue(value, "color");

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative flex items-center justify-center group">
        <div class="relative flex items-center justify-center 
                    min-w-11 h-11
                    rounded-[18px] ${bgColor} 
                    text-white text-[14px] font-black
                    shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] 
                    border-[2.5px] border-white
                    transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-1">
          
          <span class="drop-shadow-sm">${Math.round(value)}</span>

          <div class="absolute -bottom-1.25 left-1/2 -translate-x-1/2 
                      w-3 h-3 ${bgColor} rotate-45 
                      border-r-[2.5px] border-b-[2.5px] border-white"></div>
        </div>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 40],
  });
};

export type StationData = {
  id: string;
  lat: number;
  lng: number;
  aqi: number;
  temperature: number;
}

export default function Map({
  lat,
  lng,
}: {
  lat: number | null;
  lng: number | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [parameter, setParameter] = useState("aqi");

  const { data: markers = [],
    isPending,
    isFetching,
    isError
  } = useQuery({
    queryKey: ["map-aqi-bounds"],
    queryFn: async ({ signal }) => {
      const res = await http.get("/api/maps/aqi", {
        signal
      });
      return res.data;
    },

    staleTime: 30000,
  });

  const showFullLoader = isPending || (isFetching && markers.length === 0);
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
        {/* <MapEvents onBoundsChange={setBounds} /> */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {markers && markers.length > 0 ? (markers.map((station: StationData) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={aqiIcon(parameter == 'aqi' ? station.aqi : station.temperature, parameter)}
            eventHandlers={{ click: () => setSelectedStation(station) }}
          />
        ))) : <div className="absolute top-20 left-1/2 -translate-x-1/2 z-1000 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-amber-200 flex items-center gap-2">
            <span className="text-amber-600 text-sm font-medium">
              No air quality stations found in this area.
            </span>
            <ZoomOutButton />
          </div>
        </div>}
        <MapFlyController center={targetCoords} />
      </MapContainer>

      <div className="absolute top-20 md:top-25 right-0 md:right-6 z-50 w-full max-w-120 px-4 md:px-0">
        <MapSearchBar
          onLocationSelect={(lat, lng) => setTargetCoords([lat, lng])}
          parameter={parameter}
          setParameter={setParameter}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 h-[45vh] md:h-auto md:absolute md:top-24 md:left-6 md:w-95 md:bottom-auto">
        <AirQualityCard station={selectedStation} />
      </div>

      {showFullLoader && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
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


function ZoomOutButton() {
  const map = useMap();

  const handleZoomOut = () => {
    map.setZoom(map.getZoom() - 2);
  };

  return (
    <button
      onClick={handleZoomOut}
      className="pointer-events-auto mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
    >
      Try zooming out
    </button>
  );
}