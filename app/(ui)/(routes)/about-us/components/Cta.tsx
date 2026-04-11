"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Wind } from 'lucide-react';
import Link from 'next/link';

const Cta = () => {
    return (
        <section className="pb-24 pt-10 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative overflow-hidden bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-200"
                >
                    {/* --- Animated Background Elements --- */}
                    {/* A pulsing glow in the top right */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[100px] pointer-events-none"
                    />

                    {/* A secondary glow in the bottom left */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400 rounded-full blur-[100px] pointer-events-none"
                    />

                    {/* --- Content --- */}
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mb-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl inline-block"
                        >
                            <Wind className="w-8 h-8 text-blue-100" />
                        </motion.div>

                        <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-4xl md:text-6xl font-bold mb-8 tracking-tight max-w-2xl"
                        >
                            Take the first breath towards a <span className="text-blue-200">healthier future.</span>
                        </motion.h3>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-blue-100 text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
                        >
                            Join thousands of users monitoring their environment in real-time.
                            Clean air shouldn't be a mystery.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={'/products'}
                                className="group bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-all flex items-center gap-3"
                            >
                                Check Local Air Quality
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Subtle decorative "Air streaks" */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M-20 50 Q 25 40 50 50 T 120 50"
                            stroke="white"
                            fill="transparent"
                            strokeWidth="0.5"
                            animate={{ x: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}

export default Cta;