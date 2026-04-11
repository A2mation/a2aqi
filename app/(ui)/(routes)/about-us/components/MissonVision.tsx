"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Zap, Eye, Leaf } from "lucide-react";

const MissonVision = () => {

    const data = [
        {
            icon: Zap,
            title: "Our Mission",
            accent: "text-blue-400",
            bg: "group-hover:bg-blue-500/10",
            content: "We empower everyone to take control of their environment by providing real-time, user-friendly access to air quality data. Our goal is to transform complex metrics into actionable insights."
        },
        {
            icon: Eye,
            title: "Our Vision",
            accent: "text-indigo-400",
            bg: "group-hover:bg-indigo-500/10",
            content: "We envision a future where everyone is aware of the air they breathe, where clean air is recognized as a fundamental right. We aim to form a global community dedicated to breathing freely."
        }
    ];

    return (
        
        <section className="relative py-24 px-6 md:px-12 lg:px-24 rounded-4xl">

            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-white to-transparent z-10" />

            <div className="max-w-7xl mx-auto relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                        <Leaf className="h-4 w-4 text-blue-600" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">Core Purpose</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-blue-900 tracking-tight transition-colors duration-700 group-in-view:text-white">
                        Why We Do <span className="text-blue-600">What We Do</span>
                    </h2>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {data.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: (i: number) => ({
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: i * 0.15, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
                                    }),
                                }}
                                className="group"
                            >
                                <CardSpotlight
                                    /* CHANGE 3: Semi-transparent Glass Effect 
                                       Using blue-900/90 with a backdrop blur makes it feel 
                                       integrated rather than just a black box.
                                    */
                                    className="h-full w-full p-8 md:p-12 flex flex-col bg-blue-900/95 backdrop-blur-xl border border-blue-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                                >
                                    <div className={`relative z-20 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-800 border border-blue-700 ${item.accent} ${item.bg} transition-all duration-500 group-hover:rotate-6`}>
                                        <Icon className="h-8 w-8" strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-3xl font-bold relative z-20 text-white mb-6">
                                        {item.title}
                                    </h3>

                                    <p className="text-blue-400 relative z-20 text-lg leading-relaxed mb-8">
                                        {item.content}
                                    </p>

                                    <div className="mt-auto relative z-20">
                                        <div className="h-px w-full bg-linear-to-r from-blue-800 to-transparent mb-6" />
                                        <button className={`text-sm font-semibold ${item.accent} flex items-center gap-2 group-hover:gap-3 transition-all`}>
                                            Explore our roadmap <span>→</span>
                                        </button>
                                    </div>
                                </CardSpotlight>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MissonVision;