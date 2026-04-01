"use client"

import {
  Droplets,
  Locate,
  Sun,
  Map as MapIcon,
} from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { format } from "date-fns"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { SparklesCore } from "../ui/sparkles"
import { Button } from "@/components/ui/button"
import DashboardToggle from "../ui/DashboardToggle"
import { useLocationStore } from "@/store/location.store"
import { AQIDashboardLoader } from "./loaders/aqi-dashboard-loader"
import { detectIpLocation, detectGpsLocation } from "@/store/location.actions"
import { getAQITheme, AQITheme, getAQIRecommendation } from "@/helpers/aqi-color-pallet"


const AQIMap = dynamic(() => import("./aqi-map"), { ssr: false })


const AirQualityImages: Record<string, string> = {
  Good: "/assets/aqi-moods/Good.png",
  Moderate: "/assets/aqi-moods/Moderate.png",
  Poor: "/assets/aqi-moods/Poor.png",
  Unhealthy: "/assets/aqi-moods/Unhealthy.png",
  Severe: "/assets/aqi-moods/Severe.png",
  Hazardous: "/assets/aqi-moods/Hazard.png",
};

export default function AQIDashboard() {
  const {
    location, state, country, loading, lastUpdated,
    temp, humidity, aqi, source, error
  } = useLocationStore()

  const [view, setView] = useState<"aqi" | "temp">("aqi");
  const [theme, setTheme] = useState<AQITheme>(getAQITheme(0))

  useEffect(() => {
    const initLocation = async () => {
      try { await detectGpsLocation() } catch { await detectIpLocation() }
    }
    initLocation()
  }, [])

  useEffect(() => {
    if (typeof aqi === "number") setTheme(getAQITheme(aqi))
  }, [aqi])

  if (loading && !lastUpdated) return <AQIDashboardLoader />
  if (error) return <section className="min-h-screen flex items-center justify-center text-destructive font-bold">{error}</section>

  return (
    <section className="min-h-fit bg-background text-foreground selection:bg-primary/20">

      <main className="pt-28 pb-12 px-6 max-w-400 mx-auto space-y-12">

        {/* --- Hero Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "lg:col-span-8 rounded-4xl p-8 md:p-12 border border-border/60 hover:shadow-lg flex flex-col justify-between relative transition-colors duration-700",
              `bg-linear-to-br from-${theme.bg}`
            )}
            style={{ minHeight: "450px" }}
          >
            {/* Floating Mood Image Layer */}
            <motion.div
              key={theme.label}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="absolute top-[43%] right-2 md:right-10 -translate-y-1/2 pointer-events-none z-0"
            >
              <Image
                src={AirQualityImages[theme.label] || AirQualityImages.Good}
                alt={theme.label}
                width={160}
                height={160}
                className="object-contain"
                priority
              />
            </motion.div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 text-white text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase rounded-full shadow-lg"
                  style={{ backgroundColor: theme.color }}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                  </span>
                  LIVE STATUS • {location?.split(',')[0].toUpperCase() || 'LOCAL'}, {state ? `${state.toUpperCase()}, ` : ''}{country || 'CH'}
                </span>

                <div className="hidden md:flex flex-col items-end opacity-60">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Last Updated</span>
                  <span className="text-[10px] font-bold text-foreground">
                    {lastUpdated ? format(new Date(lastUpdated), 'iii, hh:mm a') : '--:--'}
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none text-foreground max-w-2xl">
                Your air quality is
                <span className="ml-4 px-4 py-2 rounded-full" style={{ color: theme.color }}>
                  {theme.label}
                </span>
                .
              </h1>

              {/* Weather Quick-Stats */}
              <div className="mt-10 flex flex-wrap gap-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                  whileHover={{ y: -4 }}
                  className="bg-background/30 backdrop-blur-md px-4 md:px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-xl transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <motion.div
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sun className="h-5 w-5 text-orange-500" />
                    </motion.div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1.5 opacity-80">
                      Current Temp
                    </p>
                    <p className="text-3xl font-black tracking-tighter text-foreground italic">
                      {temp != null ? `${parseFloat(temp.toString()).toFixed(1)}°` : '--'}
                      <span className="text-xl font-bold text-muted-foreground/60 not-italic ml-1">C</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                  whileHover={{ y: -4 }}
                  className="bg-background/30 backdrop-blur-md px-4 md:px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-xl transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <motion.div
                      animate={{
                        y: [0, -4, 0],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Droplets className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] leading-none mb-1.5 opacity-80">
                      Relative Humidity
                    </p>
                    <p className="text-3xl font-black tracking-tighter text-foreground italic">
                      {humidity != null ? `${Math.round(humidity)}` : '--'}
                      <span className="text-xl font-bold text-muted-foreground/60 not-italic ml-1">%</span>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between relative z-10 gap-6 mt-12">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-sm font-bold tracking-widest uppercase text-muted-foreground">CURRENT AQI</span>
                <span className="text-8xl md:text-9xl font-black -mt-4" style={{ color: theme.color }}>
                  {aqi || '--'}
                </span>
                <div className="flex items-start flex-col gap-1.5 mt-2 opacity-70">
                  <div className="flex items-center justify-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-tighter text-muted-foreground">Source: {source || 'Station Data'}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-tighter text-muted-foreground">Powered by: {'A2mation'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/40  backdrop-blur-xl p-6 rounded-2xl border border-border/50 max-w-sm shadow-xl transition-all duration-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                    RECOMMENDATION
                  </span>
                  {/* Subtle badge for the specific alert level */}
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                    style={{
                      color: theme.color,
                      backgroundColor: `${theme.color}15`
                    }}
                  >
                    {getAQIRecommendation(aqi || 0).short}
                  </span>
                </div>

                <p className="text-foreground font-semibold text-sm leading-relaxed">
                  {aqi ? getAQIRecommendation(aqi).text : "Fetching real-time local air quality data..."}
                </p>

                {/* Optional: Small "Action" footer for premium feel */}
                {aqi && aqi > 100 && (
                  <div className="mt-4 pt-4 border-t border-border/20 flex items-center gap-2 text-red-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      Mask Recommended
                    </span>
                  </div>
                )}
              </div>
            </div>

            <SparklesCore
              className="absolute inset-0 pointer-events-none opacity-30"
              background="transparent"
              minSize={0.6}
              maxSize={1.8}
              particleDensity={10 * (aqi ? aqi : 1)}
              particleColor="#000000"
            />
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, x: +20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 h-full"
          >
            <section
              className={cn("rounded-4xl p-6 border border-border/60 hover:shadow-lg h-full flex flex-col shadow-inner",
                `bg-linear-to-br from-${theme.bg}`
              )}
            >
              {/* Header & Layer Toggles */}
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black tracking-tight leading-none">Localized Map</h2>
                  <p className="text-[10px] text-muted-foreground">Nearby monitoring stations</p>
                </div>

                <DashboardToggle view={view} setView={setView} />
              </div>

              {/* Map Container */}
              <div className="relative grow rounded-2xl overflow-hidden border border-border/40 min-h-100">
                <AQIMap view={view} />

                <div className="absolute top-3 right-3 flex items-center gap-2.5 z-1000">

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/air-quality-map"
                      className="flex h-10 items-center gap-2.5 px-5 bg-background/90 backdrop-blur-md text-foreground rounded-xl border border-border/50 shadow-lg text-xs font-bold leading-none active:scale-95 transition-all"
                    >
                      <MapIcon className="h-4 w-4 text-primary" />
                      <span>View Full Map</span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-background/90 backdrop-blur-md shadow-lg border border-border/50"
                      onClick={detectGpsLocation}
                    >
                      <Locate className="h-4 w-4 text-foreground" />
                    </Button>
                  </motion.div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div
                    className={cn(
                      "backdrop-blur-sm p-3 rounded-xl border shadow-lg flex items-center gap-3",
                      theme.card
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        theme.borderClass,
                        theme.card
                      )}
                      style={{
                        color: theme.color
                      }}
                    >
                      {view == 'aqi' ? Math.round(aqi ?? 0) : Math.round(temp ?? 0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        {location?.split(',')[0].toUpperCase() || 'LOCAL'}, {state ? `${state.toUpperCase()}, ` : ''}{country || 'CH'}
                      </p>
                      <p className="text-[11px] font-medium leading-none">
                        Moderate Conditions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </section>

      </main>
    </section>
  )
}