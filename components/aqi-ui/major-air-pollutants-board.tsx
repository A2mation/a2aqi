'use client'

import React, { useEffect, useMemo, useState } from "react"
import { AlertCircle, ArrowUpRight, Wind, Activity } from "lucide-react"
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"

import { Card } from "@/components/ui/card"
import { AQITheme, getAQITheme } from "@/helpers/aqi-color-pallet"
import { useLocationStore } from "@/store/location.store"
import { PollutantType } from "@/helpers/pollutant-color-pallet"
import { cn } from "@/lib/utils"

// Helper for Tailwind shadow/glow colors based on hex
const getGlowStyles = (color: string) => ({
  boxShadow: `0 0 40px -10px ${color}33`,
  borderTop: `1px solid ${color}44`
})

export default function AirQualityDashboard() {
  const { aqi, pm10, pm25, so2, o3, co, no2, error } = useLocationStore();
  const [theme, setTheme] = useState<AQITheme>(getAQITheme(0))

  const pollutants = useMemo(() => [
    { name: "Fine Particles", formula: "PM2.5", value: pm25 ?? null, unit: "µg/m³", icon: "/assets/pm2.5-parameter.png" },
    { name: "Inhalable Particles", formula: "PM10", value: pm10 ?? null, unit: "µg/m³", icon: "/assets/pm10-perameter.png" },
    { name: "Carbon Monoxide", formula: "CO", value: co ?? null, unit: "ppb", icon: "/assets/co-icon.png" },
    { name: "Sulfur Dioxide", formula: "SO2", value: so2 ?? null, unit: "ppb", icon: "/assets/so2-icon.png" },
    { name: "Nitrogen Dioxide", formula: "NO2", value: no2 ?? null, unit: "ppb", icon: "/assets/no2-icon.png" },
    { name: "Ozone", formula: "O3", value: o3 ?? null, unit: "ppb", icon: "/assets/o3.svg" },
  ], [pm10, pm25, so2, o3, co, no2])

  useEffect(() => {
    if (typeof aqi === "number") setTheme(getAQITheme(aqi))
  }, [aqi])

  if (error) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6 md:p-16 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* --- Header Section --- */}
        <header className="relative flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.color }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.color }}></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">Real-time Analysis</span>
            </motion.div>

            <h1 className="text-5xl font-light tracking-tight text-slate-900 md:text-6xl">
              Air <span className="font-extrabold italic text-slate-800">
                Quality
              </span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">Detailed monitoring of atmospheric pollutants and particulate matter.</p>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Status</p>
              <p className="text-xl font-bold" style={{ color: theme.color }}>{theme.label}</p>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <Image src="/assets/a2mation-logo.png" width={110} height={14} alt="A2Mation" className="opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {pollutants.map((pollutant, index) => {
              const currentTheme = getAQITheme(pollutant.value ?? 0);
              const isHigh = (pollutant.value ?? 0) > 100;

              return (
                <motion.div
                  key={pollutant.formula}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    className={cn(
                      "relative bg-white/70 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-8 h-full transition-all duration-500 group",
                      `bg-linear-to-br from-${currentTheme.bg}`
                    )}
                    // style={getGlowStyles(currentTheme.color)}
                  >
                    {/* Background Decorative Element */}
                    <div
                      className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
                      style={{ backgroundColor: currentTheme.color }}
                    />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      {/* Top Row: Icon & Label */}
                      <div className="flex justify-between items-start mb-12">
                        <div className={cn(
                          "p-4 rounded-2xl border shadow-inner group-hover:scale-105 transition-transform duration-500",
                          `bg-linear-to-br from-${currentTheme.bg}`
                        )}>
                          <Image
                            src={pollutant.icon}
                            width={60}
                            height={40}
                            alt={pollutant.formula}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-right">
                          <p
                            className="text-3xl font-black text-slate-800 leading-tight"
                            // style={{ color: currentTheme.color }}
                          >{pollutant.formula}</p>
                        </div>
                      </div>

                      {/* Middle: Name & Value */}
                      <div className="space-y-4">
                        <div>
                          <h3
                            className="text-md font-bold  uppercase tracking-widest mb-1 flex items-center gap-1.5"
                            // style={{ color: currentTheme.color }}
                          >
                            <Activity className="w-3 h-3" />
                            {pollutant.name}
                          </h3>
                          <div className="flex items-baseline gap-3">
                            <span
                              className="text-6xl font-bold tracking-tighter "
                              style={{ color: currentTheme.color }}
                            >
                              {pollutant.value ?? "--"}
                            </span>
                            <span className="text-sm font-bold text-slate-400">
                              {pollutant.unit}
                            </span>
                          </div>
                        </div>

                        {/* Status Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((pollutant.value ?? 0) / 2, 100)}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: currentTheme.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}