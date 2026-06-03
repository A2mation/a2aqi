import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Activity, Zap, CloudRain, Thermometer, Droplets, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import ColourfulText from '@/components/ui/colourful-text';

export const Parameters = () => {
    const pollutants = [
        { title: 'PM 2.5', desc: 'Fine particles can penetrate deep into the lungs and may even enter the bloodstream. These particles mainly come from vehicle smoke, factories, and burning fuels.', icon: '/assets/pm2.5-parameter.png' },
        { title: 'PM 10', desc: 'Coarser particles usually affect the upper parts of the respiratory system, such as the nose and throat. Although less harmful than fine particles, prolonged exposure can still affect health.', icon: '/assets/pm10-perameter.png' },
        { title: 'TVOC', desc: 'Volatile organic compounds (VOCs) are harmful gases released from paints, furniture, cleaning products, and building materials.', icon: "/assets/tvoc.svg" },
        { title: 'CO', desc: 'Elevated carbon dioxide (CO2) levels indicate poor ventilation in indoor spaces. High CO2 levels can cause drowsiness, headaches, and reduced concentration.', icon: '/assets/co-icon.png' },
        { title: 'Temperature', desc: 'Maintaining optimal indoor conditions ensures comfort, good health, and improved productivity.', icon: "/assets/temperature.svg" },
        { title: 'Humidity', desc: 'High humidity creates a favorable environment for mold and mildew growth indoors. It may cause allergies, breathing problems, and unpleasant odors.', icon: "/assets/humidity.svg" },
    ];


    const sensorIcons: Record<string, string> = {
        pm25: "/assets/pm2.5-parameter.png",
        pm10: "/assets/pm10-perameter.png",
        pm1: "/assets/pm1-parameter.png",
        temperature: "/assets/temperature.svg",
        humidity: "/assets/humidity.svg",
        noise: "/assets/noise.svg",
        tvoc: "/assets/tvoc.svg",
    };


    return (
        <div className="font-sans w-full p-4">
            {/* Header Section */}
            <div className="text-center mb-16">
                <h2 className="text-2xl md:text-6xl font-black text-slate-900 mb-2 tracking-tight">
                    Complete Indoor <ColourfulText text="Air Quality" />
                </h2>
                <h3 className="text-4xl md:text-7xl uppercase font-black text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-blue-500 to-cyan-400">
                    Monitoring Solution
                </h3>
                <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    6 Pollutants Tracked (Live Data)
                </div>
            </div>

            {/* Aura Container Wrapper - Multi-color Border Effect */}
            <div className="relative group w-full p-0.5 md:p-2.5 rounded-[3.1rem] bg-linear-to-r from-blue-600 via-purple-500 to-cyan-400 shadow-2xl transition-all duration-500 hover:shadow-blue-200/50">

                {/* Inner Content Layer */}
                {/* We use bg-white/95 to allow a tiny bit of glassmorphism or stay solid white */}
                <div className="relative bg-white rounded-[2.9rem] p-8 md:p-16 border border-slate-100/50">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pollutants.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                // Key changes: We added 'translate-z-0' for GPU acceleration and 
                                // changed the hover to include a slight lift (negative Y) and a border-color shift.
                                className="group/card relative p-8 bg-slate-50 border border-slate-200/60 rounded-[2.5rem] 
                 transition-all duration-500 ease-out cursor-default
                 hover:-translate-y-3 hover:bg-white
                 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] 
                 hover:border-blue-200/50"
                            >
                                {/* Background Decorative Gradient - subtle hint of color on hover */}
                                <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover/card:from-blue-50/50 group-hover/card:to-cyan-50/50 transition-colors duration-500" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        {/* Icon Container with Glass Effect */}
                                        <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 
                                        group-hover/card:bg-blue-600 group-hover/card:text-white 
                                        group-hover/card:shadow-lg group-hover/card:shadow-blue-200 
                                        group-hover/card:-rotate-6
                                        transition-all duration-500 ease-in-out"
                                        >
                                            <Image
                                                src={item.icon}
                                                width={90}
                                                height={90}
                                                alt={item.title}
                                                className="group-hover/card:brightness-0 group-hover/card:invert transition-all duration-500"
                                            />
                                        </div>

                                        <div className="flex flex-col items-end">
                                            {/* Title with tracking-tight for a more modern tech look */}
                                            <h4 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight group-hover/card:text-blue-700 transition-colors duration-300">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Description with improved typography */}
                                    <p className="text-lg text-slate-500 leading-relaxed font-medium group-hover/card:text-slate-600 transition-colors duration-300">
                                        {item.desc}
                                    </p>

                                    {/* Subtle "Learn More" or Arrow that appears on hover */}
                                    <div className="mt-6 flex items-center gap-2 text-blue-600 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500 delay-100">
                                        <span className="text-xs font-bold uppercase tracking-widest">Live Metrics</span>
                                        <div className="h-px w-8 bg-blue-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className='text-red-600 text-sm opacity-50 text-center w-full pt-3'>
                        **Parameters Modification option only available on industrial products**
                    </div>

                    {/* Footer Section */}
                    <div className="mt-20 pt-12 border-t border-slate-100 flex flex-wrap items-center justify-center md:justify-between gap-10">
                        <div>
                            <Image
                                src="https://res.cloudinary.com/dvlzmzztg/image/upload/v1777375516/blog_content_images/mlsrrvlgm77semahlbxd.png"
                                alt="Product"
                                height={200}
                                width={200}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-12 transition-all duration-700">
                            <div className='text-center'>
                                <div className='w-full flex items-center justify-center mb-2'>
                                    <ShieldCheck size={50} className='text-blue-600' />
                                </div>
                                <div className="flex items-center justify-center gap-2 text-blue-600 font-bold">
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">One Year Warranty</p>
                                </div>
                                <p className="text-slate-400 text-xl font-medium">and lifetime professional support</p>
                            </div>
                        </div>

                        <div>
                            <Image
                                src="/assets/ce-reset-certificate.webp"
                                alt="Certificate"
                                height={300}
                                width={300}
                            />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};