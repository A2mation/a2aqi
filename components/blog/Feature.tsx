"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Featured = () => {
    const router = useRouter();
    return (
        <section className="relative mt-16 mb-24 px-4">
            <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl" />

            <header className="max-w-5xl mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-slate-900 dark:text-white"
                >
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                        Hey, Buddy!
                    </span>
                    <br />
                    Hold a minute and take a deep breath.
                </motion.h1>
            </header>

            <div className="flex flex-col lg:flex-row items-stretch gap-12 xl:gap-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="lg:flex-1 relative group"
                >
                    <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <Image
                            src="https://www.shutterstock.com/image-photo/good-air-quality-clean-outdoor-600nw-2421635111.jpg"
                            alt="Clean air concept"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -right-6 hidden md:flex w-32 h-32 bg-white dark:bg-slate-900 rounded-full shadow-xl items-center justify-center border border-slate-100 dark:border-slate-800 rotate-12">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">
                            Pure<br />Oxygen<br />v.1
                        </p>
                    </div>
                </motion.div>

                {/* Content Side */}
                <div className="lg:flex-1 flex flex-col justify-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                            Breathe Better: Understand Air Quality and Its Impact on Your Life.
                        </h2>

                        <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                            <p>
                                Air quality plays a crucial role in our health, well-being, and daily
                                comfort. From the air we breathe indoors to pollution levels outdoors,
                                <span className="text-indigo-600 font-medium italic"> understanding air quality</span> helps us make smarter choices for a healthier life.
                            </p>

                            <p>
                                Here, you’ll find insights into air pollution, AQI levels, seasonal changes,
                                and practical tips to protect yourself and your loved ones. Take a moment,
                                slow down, and learn how cleaner air can make a real difference.
                            </p>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-3 w-fit px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.3)] cursor-pointer"
                        onClick={()=>router.push('/products')}
                    >
                        EXPLORE AQI PRODUCT
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default Featured;