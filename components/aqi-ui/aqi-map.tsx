"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { useLocationStore } from "@/store/location.store";
import { getAQIBgColor, getAQIStatus, getAQITheme } from "@/helpers/aqi-color-pallet";
import AQIMapLoader from "./loaders/aqi-map-loader";
import { motion } from "motion/react";

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

type AQIMarker = {
  id: string;
  location: string;
  lat: number;
  lng: number;
  aqi: number;
  temp: number;
};

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

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

export default function AQIMap({ view }: { view: "aqi" | "temp" }) {
  const {
    lat,
    lng,
  } = useLocationStore();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, []);

  const { data: markers, isLoading, error } = useQuery<AQIMarker[]>({
    queryKey: ["nearby-aqi", lat, lng],
    queryFn: async () => {
      if (lat == null || lng == null) return [];
      const res = await http.get(`/api/location/nearby-cities?lat=${lat}&lon=${lng}`);


      return res.data.map((city: any) => ({
        id: city.id || city.name,
        location: city.name,
        lat: city.lat,
        lng: city.lng,
        aqi: city.aqi ?? 0,
        temp: city.temperature,
        status: getAQIStatus(city.aqi ?? 0),
        name: city.location,
        humidity: city.humidity ?? 0,
        source: city.source ?? "CPCB",
      }));
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 5,
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <AQIMapLoader />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full text-destructive text-xs font-bold">
        Failed to load localized map data.
      </div>
    );
  }


  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow">
      {lat != null && lng != null && (
        <MapContainer
          center={[lat, lng]}
          zoom={8}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers?.map((station) => {
            const stationTheme = getAQITheme(station.aqi);

            return (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={aqiIcon(view === "aqi" ? station.aqi : Math.round(station.temp as any))}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -15]}
                  opacity={1}
                  className="bg-transparent p-0"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl min-w-45"
                    style={{ borderLeft: `4px solid ${view === "aqi" ? stationTheme.color : "transparent"}` }}
                  >
                    {/* Background Glow */}
                    <div
                      className="absolute -right-8 -top-8 w-16 h-16 blur-2xl rounded-full opacity-20"
                      style={{ backgroundColor: view ? stationTheme.color : "transparent", }}
                    />

                    <div className="px-4 py-3 relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">
                            {view === "aqi" ? "Monitoring Station" : "Weather Station"}
                          </p>
                          <p className="text-sm font-black text-foreground tracking-tight leading-tight">
                            {station.location}
                          </p>
                        </div>

                        {/* Animated Status Dot */}
                        <div
                          className="h-2 w-2 rounded-full animate-pulse"
                          style={{
                            backgroundColor: view ? stationTheme.color : "transparent",
                            boxShadow: `0 0 10px ${view === "aqi" ? stationTheme.color : "transparent"}`
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/40">
                        {view === "aqi" ? (
                          /* AQI VIEW LAYOUT */
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-muted-foreground">Live AQI :</span>
                              <span className="text-base font-black italic" style={{ color: stationTheme.color }}>
                                {station.aqi}
                              </span>
                            </div>
                            <div
                              className="mt-1 inline-flex items-center justify-center py-1 px-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter"
                              style={{
                                backgroundColor: `${stationTheme.color}15`,
                                color: stationTheme.color
                              }}
                            >
                              {stationTheme.label} Conditions
                            </div>
                            <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((station.temp as any / 50) * 100, 100)}%` }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: stationTheme.color }}
                              />
                            </div>
                          </>
                        ) : (
                          /* TEMPERATURE VIEW LAYOUT (New Style) */
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-medium text-muted-foreground">Ambient Temperature</span>
                                <span className="text-[9px] font-bold text-orange-500/80 uppercase">Thermal Index</span>
                              </div>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-2xl font-black italic tracking-tighter" style={{ color: stationTheme.color }}>
                                  {Math.round(station.temp as any)}
                                </span>
                                <span className="text-xs font-bold text-muted-foreground/60">°C</span>
                              </div>
                            </div>


                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
