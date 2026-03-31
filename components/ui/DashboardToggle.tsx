"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardToggle({
    view,
    setView
}: {
    view: "aqi" | "temp",
    setView: (view: "aqi" | "temp") => void
}) {


    const tabs = [
        { id: "aqi", label: "AQI" },
        { id: "temp", label: "Temperature" },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* TOGGLE SWITCH */}
            <div className="relative flex bg-muted/50 backdrop-blur-sm rounded-full p-1 border border-border/50 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setView(tab.id as "aqi" | "temp")}
                        className={cn(
                            "relative z-10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                            view === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {view === tab.id && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-20">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}