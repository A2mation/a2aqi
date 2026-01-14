"use client"

import { motion } from "framer-motion"

export function StatsSection() {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-4xl md:text-5xl lg:text-6xl text-center mb-16 leading-tight text-blue-500"
                >
                    Addressable Challenges
                </motion.h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="border-2 border-dashed border-border rounded-3xl p-8 text-center"
                    >

                        <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-400 ">Urbanization Impacts</h3>
                        <p className="text-muted-foreground font-sans leading-relaxed">
                            Urban growth worsens air pollution and water scarcity, impacting residents, and increases vulnerability to floods, challenging city resilience.
                        </p>
                    </motion.div>

                    {/* Stat 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="border-2 border-dashed border-border rounded-3xl p-8 text-center"
                    >
                        <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-400">Air Quality Concerns</h3>
                        <p className="text-muted-foreground font-sans leading-relaxed">
                            Elevated levels of pollutants in urban areas pose severe health risks to inhabitants, necessitating urgent action for air quality improvement.
                        </p>
                    </motion.div>

                    {/* Stat 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="border-2 border-dashed border-border rounded-3xl p-8 text-center"
                    >
                        <h3 className="font-serif text-2xl font-semibold mb-4 text-blue-400">Outdated Systems</h3>
                        <p className="text-muted-foreground font-sans leading-relaxed">
                            The current monitoring and response systems in place are not up to par for effectively managing various aspects within their respective domains.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
