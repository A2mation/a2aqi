import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import Image from 'next/image';

interface ImageData {
    src: string;
    title: string;
    description: string;
    isApp?: boolean
}

interface StackingScrollProps {
    data: ImageData[];
}

export const StackingScroll: React.FC<StackingScrollProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div
            ref={containerRef}
            className="relative "
            style={{ height: `${data.length * 70}vh` }}
        >
            <div className="sticky top-20 h-[90dvh] w-full">
                {data.map((item, index) => (
                    <Scene
                        key={index}
                        item={item}
                        index={index}
                        total={data.length}
                        progress={smoothProgress}
                        isApp={item.isApp}
                    />
                ))}
            </div>
        </div>
    );
};

const Scene = ({ item, index, total, progress, isApp }: {
    item: ImageData;
    index: number;
    total: number;
    progress: MotionValue<number>
    isApp?: boolean
}) => {
    const start = index / total;
    const end = (index + 1) / total;

    const y = useTransform(progress, [start - 0.15, start], ["100vh", "0vh"]);
    const scale = useTransform(progress, [start - 0.15, start, end, end + 0.1], [0.85, 1, 1, 0.95]);
    const opacity = useTransform(progress, [start - 0.15, start, end, end + 0.1], [0, 1, 1, 0]);

    return (
        <motion.div
            style={{ y, scale, opacity, zIndex: index }}
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-10"
        >
            <div className="relative w-full h-full rounded-[2.5rem] shadow-2xl">
                <Image
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[2.5rem]"
                    fill
                />

                {/* Premium Black Corner Effect (Vignette) */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

                {/* Bottom Shadow Gradient (for text readability) */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Text Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white z-10">
                    <div className="max-w-md">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                            {item.title}
                        </h2>
                        <p className="text-lg text-zinc-200 mb-8 leading-relaxed opacity-90">
                            {item.description}
                        </p>

                        {isApp && <div className="flex flex-wrap gap-4">
                            <button className="bg-white text-black px-6 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-zinc-200 transition-colors">
                                <span className="text-xs uppercase">Download on the</span>
                                <span className="font-bold">App Store</span>
                            </button>
                            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium hover:bg-white/20 transition-colors">
                                <span className="text-xs uppercase">Get it on</span>
                                <span className="font-bold">Google Play</span>
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};