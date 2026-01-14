"use client"

import { motion } from "framer-motion"
import { Handshake } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="pt-32 pb-12 px-6">
            <div className="container mx-auto max-w-5xl">
                {/* Trust Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-center gap-4 mb-8 text-sm text-muted-foreground"
                >
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        {"1,000+ Projects"}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        {"7+ Years Experience"}
                    </span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal text-center leading-[1.1] mb-6 text-balance"
                >
                    Empowering Smart Cities
                    <span className="inline-flex items-center gap-3">
                        With Real-Time Environmental Monitoring Solutions
                    </span>{" "}

                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
                >
                    Turn every visit into growth—partner with a team that's invested in your continued success.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex justify-center"
                >
                    <Button size="lg" className="rounded-full px-8  bg-blue-500 hover:bg-blue-400">
                        Explore now
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
