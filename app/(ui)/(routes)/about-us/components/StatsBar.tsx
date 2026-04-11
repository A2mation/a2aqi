"use client";

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { BarChart3, ShieldCheck, Users, Zap } from 'lucide-react';

const Counter = ({ value }: { value: string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    // Extract numbers and suffixes (e.g., "12,000+" -> 12000 and "+")
    const numericValue = parseInt(value.replace(/,/g, ''));
    const suffix = value.replace(/[0-9,]/g, '');

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    const [display, setDisplay] = useState("0");

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplay(Math.floor(latest).toLocaleString());
        });
    }, [springValue]);

    return (
        <span ref={ref}>
            {display}{suffix}
        </span>
    );
};

const StatsBar = () => {
    const stats = [
        { label: "Cities Tracked", value: "50+", icon: BarChart3, color: "text-blue-400" },
        { label: "Active Sensors", value: "100+", icon: Zap, color: "text-emerald-400" },
        { label: "Users Safe", value: "500+", icon: Users, color: "text-purple-400" },
        { label: "Data Accuracy", value: "90%", icon: ShieldCheck, color: "text-cyan-400" },
    ];

    return (
        <section className="relative bg-[#020617] py-24 ">
            {/* Subtle Background Glows */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="relative group text-center"
                        >
                            {/* Decorative border/glass effect on hover */}
                            <div className="absolute -inset-4 rounded-3xl bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={`mb-6 inline-flex p-3 rounded-2xl bg-white/3 border border-white/8 ${stat.color} group-hover:scale-110 group-hover:bg-white/5 transition-all duration-500`}>
                                <stat.icon size={28} strokeWidth={1.5} />
                            </div>

                            <h4 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                                <Counter value={stat.value} />
                            </h4>

                            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StatsBar;