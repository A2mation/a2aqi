"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, ShieldCheck, ArrowRight, Gauge, Activity } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PromoBannerModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsOpen(true), 4000);
        const hideTimer = setTimeout(() => setIsOpen(false), 18000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-120 p-0 overflow-hidden border-none bg-transparent shadow-none">
                <VisuallyHidden.Root>
                    <DialogTitle>New Arrival: a2aqi Industrial Air Quality Monitors</DialogTitle>
                </VisuallyHidden.Root>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="relative overflow-hidden rounded-[2.5rem] bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl"
                            />

                            <div className="relative p-8 md:p-10">
                                {/* Header Section */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                        <Activity size={14} className="animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Monitoring</span>
                                    </div>
                                    <Gauge size={24} className="text-red-500 dark:text-red-700" />
                                </div>

                                <div className="space-y-2">
                                    {/* Heading */}
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-[1.1] italic">
                                        Breathe <span className="text-blue-600">Intelligence.</span>
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        Deploy India&apos;s most reliable CAAQMS displays. Industrial-grade precision for smarter, safer environments.
                                    </p>
                                </div>

                                {/* Feature List */}
                                <div className="mt-8 grid grid-cols-1 gap-3">
                                    {[
                                        { label: "ISO Certified", icon: ShieldCheck },
                                        { label: "Real-time AQI / PM2.5 / PM10 / SO2", icon: Wind },
                                        { label: "High-Visibility LED Displays", icon: Gauge },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-default"
                                        >
                                            <div className="text-blue-600 dark:text-blue-400">
                                                <item.icon size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {item.label}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="mt-10 space-y-4">
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl group transition-all"
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push('/products');
                                        }}
                                    >
                                        Explore Catalog
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}