"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Map, FileText, ChevronRight } from "lucide-react";

import { useScroll } from "@/hooks/use-scroll";
import { useEffect, useState } from "react";

export function FloatingMarketingNav() {
    const isScrolled = useScroll(400); 
    const [mounted, setMounted] = useState(false);

    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isScrolled && (
                <motion.div
                    initial={{ y: 100, x: "-50%", opacity: 0 }}
                    animate={{ y: -40, x: "-50%", opacity: 1 }}
                    exit={{ y: 100, x: "-50%", opacity: 0 }}
                    className="fixed bottom-0 left-1/2 z-50 flex items-center bg-[#4a637d]/90 backdrop-blur-md rounded-full px-2 py-2 shadow-2xl border border-white/10"
                >
                    {/* PRODUCT CATALOG */}
                    <Link href="/products">
                        <NavItem 
                            icon={<ShoppingBag size={18} className="text-blue-300" />} 
                            label="Products" 
                        />
                    </Link>

                    <div className="w-px h-5 bg-white/20 mx-1" />

                    {/* LIVE MAPS */}
                    <Link href="/air-quality-map">
                        <NavItem 
                            icon={<Map size={18} className="text-emerald-300" />} 
                            label="Live Maps" 
                        />
                    </Link>

                    <div className="w-px h-5 bg-white/20 mx-1" />

                    {/* GET BEST QUOTE */}
                    <Link href="tel:+918777353002">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#4a637d] hover:bg-blue-50 transition-all group shadow-lg">
                            <FileText size={18} />
                            <span className="text-[10px] md:text-sm font-black tracking-tight uppercase">Get Best Quote</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-all group">
            <div className="group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-white text-[10px] md:text-sm font-bold tracking-tight">{label}</span>
        </button>
    );
}