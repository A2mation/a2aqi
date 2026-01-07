"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { http } from "@/lib/http";
import { useLocationStore } from "@/store/location.store";
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

type AQIMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
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

export default function AQIMap() {
  const [markers, setMarkers] = useState<AQIMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    lat,
    lng,
  } = useLocationStore();
  const [mounted, setMounted] = useState(false)




  useEffect(() => {
    async function fetchAQIData() {
      if (lat == null || lng == null) return;
      try {
        const res = await http.get(
          `/api/location/nearby-cities?lat=${lat}&lon=${lng}`
        );
        const data = res.data;

        const normalized: AQIMarker[] = data.map((city: any) => ({
          id: city.name,
          name: city.name,
          lat: city.lat,
          lng: city.lon,
          aqi: city.aqi?.data.aqi ?? 0,
        }));

        setMarkers(normalized);
      } catch (err) {
        console.error("Failed to load AQI data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAQIData();
  }, [lat, lng]);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading AQI map...
      </div>
    );
  }

  if (!mounted) return null


  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow">
      {
        lat != null && lng != null && (
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
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

        )
      }
    </div>
  );
}
