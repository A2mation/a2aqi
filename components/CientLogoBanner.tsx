'use client'

import { motion } from "motion/react"

interface Logo {
    name: string
    src: string
}

interface ClientLogosProps {
    logos: Logo[]
}

export function ClientLogosBanner({ logos }: ClientLogosProps) {
    return (
        <section className="py-15 px-6 border-y border-border bg-[#F8FAFC]">
            <div className="container mx-auto">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-600 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[11px] md:text-sm mb-3"
                    >
                        Our Network
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl md:text-4xl font-light text-slate-400 text-center leading-tight"
                    >
                        Trusted by global <span className="text-slate-900 font-medium md:block lg:inline">industry leaders</span>
                    </motion.h2>
                </div>

                <div className="flex items-center justify-center gap-12 flex-wrap">
                    {logos.map((logo) => (
                        <div key={logo.name} className="flex items-center justify-center h-20">
                            <img
                                src={logo.src || "/placeholder.svg"}
                                alt={logo.name}
                                className="h-full w-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
