"use client"


import { motion } from "framer-motion"

export function ApproachSection() {
    const steps = [
        {
            number: "01",
            title: "Health and Safety:",
            description:
                "Enhanced air quality reduces health risks, improving overall urban livability.",
        },
        {
            number: "02",
            title: "Urban Planning:",
            description:
                "Data-driven insights aid in traffic and infrastructure development, promoting sustainable mobility.",
        },
        {
            number: "03",
            title: "Informed Investments:",
            description:
                "Access to flood risk data guides better infrastructure decisions, supporting resilient urban development.",
        },
        {
            number: "04",
            title: "Civic Engagement:",
            description:
                "Real-time information sharing boosts transparency & community engagement in urban management.",
        },
        {
            number: "05",
            title: "Emergency Preparedness:",
            description:
                "Real-time data facilitates effective responses to natural disasters, minimizing damage.",
        },
    ]

    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl md:text-6xl mb-6 text-balance text-blue-500"
                    >
                        The Benefits We Can Derive
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        A proven process that transforms your vision into high-converting digital experiences
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

                    <div className="space-y-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Step Number Circle */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl font-bold relative z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                                    {step.number}
                                </div>

                                {/* Content Card */}
                                <div
                                    className={`flex-1 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"} md:w-1/2`}
                                >
                                    <div className="bg-secondary p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                                        <h3 className="font-serif text-2xl md:text-3xl mb-4 text-blue-400">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
