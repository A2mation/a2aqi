"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ProductAdBanner = () => {
    const router = useRouter();

    return (
        <section
            className="relative h-160 mt-24 w-full bg-cover bg-center bg-no-repeat flex items-center"
            style={{
                backgroundImage: "url('/assets/woman-sat-on-a-sofa.png')",
            }}
        >

            <div className="absolute inset-0 bg-black/20 z-0" />

            <div className="container mx-auto px-6 md:px-12 z-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Left/Center */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-[55%] bg-emerald-950/10 backdrop-blur-md px-8 py-10 md:p-12 rounded-2xl shadow-2xl border border-white/10"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3 block"
                    >
                        Premium Air Quality
                    </motion.span>

                    <h2 className="text-white text-3xl md:text-5xl font-light tracking-tight leading-tight mb-6">
                        Breathing Fresh Air Is Not An Option, <br />
                        <span className="font-serif italic text-emerald-300">It Is Our Right.</span>
                    </h2>

                    <p className="text-gray-300 text-sm md:text-base font-light max-w-md mb-8 leading-relaxed">
                        Experience pure, uncompromised breathing spaces designed for your well-being and peace of mind.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white text-emerald-950 cursor-pointer px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-lg hover:bg-emerald-50 transition-colors"
                        onClick={() => router.push('/products')}
                    >
                        Discover More
                    </motion.button>
                </motion.div>

                {/* Right Floating Product Image */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className="relative w-full md:w-[40%] flex justify-center items-center h-full"
                >
                    <div className="absolute w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full z-0" />

                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    >
                        <Image
                            src="/assets/standard-sensor-box-bg-remove.png"
                            alt="Standard Sensor Box"
                            width={500}
                            height={500}
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default ProductAdBanner;