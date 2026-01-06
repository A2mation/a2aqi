"use client"

import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const markers = [
  { id: 1, lat: 22.5726, lng: 88.3639, value: 211, x: "45%", y: "42%" },
  { id: 2, lat: 22.6, lng: 88.4, value: 199, x: "52%", y: "48%" },
  { id: 3, lat: 22.55, lng: 88.42, value: 205, x: "48%", y: "32%" },
  { id: 4, lat: 22.62, lng: 88.38, value: 198, x: "58%", y: "35%" },
  { id: 5, lat: 22.58, lng: 88.36, value: 203, x: "42%", y: "52%" },
  { id: 6, lat: 22.54, lng: 88.45, value: 202, x: "65%", y: "28%" },
  { id: 7, lat: 22.59, lng: 88.41, value: 203, x: "72%", y: "18%" },
]

export function AQIMap() {


  const getMarkerColor = (value: number) => {
    if (value <= 50) return "bg-green-500"
    if (value <= 100) return "bg-yellow-500"
    if (value <= 150) return "bg-orange-500"
    if (value <= 200) return "bg-red-500"
    if (value <= 300) return "bg-purple-500"
    return "bg-purple-800"
  }



  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      {/* Mock Map Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Map Interface Elements */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <Button variant="secondary" size="sm" className="bg-white shadow-lg">
          🗺️ AQI Map
        </Button>
        <Button variant="ghost" size="sm" className="bg-white/80 shadow">
          ☀️ Weather
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button variant="secondary" size="sm" className="bg-white shadow-lg gap-2">
          AQI Map
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* AQI Markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-500"
          style={{ left: marker.x, top: marker.y }}
        >
          <div className="relative group cursor-pointer">
            <div
              className={`${getMarkerColor(marker.value)} rounded-full px-4 py-2 shadow-lg font-bold text-white text-sm hover:scale-110 transition-transform`}
            >
              {marker.value}
            </div>
            <div className="absolute inset-0 rounded-full bg-current opacity-30 animate-ping" />
          </div>
        </div>
      ))}

      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">
        Map Data © OpenStreetMap
      </div>
    </div>
  )
}


const MapLoading = () => {
  return <div
    className="absolute inset-0 opacity-30"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
}