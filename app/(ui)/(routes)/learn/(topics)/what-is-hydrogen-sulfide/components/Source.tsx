
"use client"

import { motion } from 'motion/react'


const Source = () => {
    const naturalSources = [
        {
            title: "Volcanic Gases",
            description: "During volcanic activity, volcanoes naturally release H2S gas through their vents and cracks.",
            icon: "🌋",
        },
        {
            title: "Gas wells",
            description: "H2S gas may be present in natural gas wells and could be released during production and drilling.",
            icon: "⛽",
        },
        {
            title: "Natural Gas Reservoirs",
            description:
                "It may be present in natural gas reservoirs, and can be discharged during processing and extraction.",
            icon: "🏭",
        },
        {
            title: "Natural Springs",
            description:
                "As sulfur-containing minerals react with water to produce H2S gas, natural springs can be a source of H2S gas.",
            icon: "💧",
        },
        {
            title: "Crude Petroleum",
            description:
                "Crude petroleum may produce H2S gas during extraction and processing, posing health and safety issues.",
            icon: "🛢️",
        },
    ]

    const industrialSources = [
        {
            title: "Sewage Treatment",
            description:
                "From the decomposition of the organic content in wastewater, sewage treatment plants might emit H2S gas.",
            icon: "🏗️",
        },
        {
            title: "Refineries",
            description:
                "Refineries can generate H2S gas by the processing of sulphur-containing crude oil. The gas can pose threat to ones health and safety.",
            icon: "🏢",
        },
        {
            title: "Kraft Paper Mills",
            description:
                "In the pulping process, kraft paper mills use chemicals based on sulphur, which produces H2S gas as a byproduct",
            icon: "🏭",
        },
        {
            title: "Food Processing",
            description:
                "Food processing units that utilize sulphurs and sulphuric acid emit H2S gas into the surrounding environment.",
            icon: "🏪",
        },
        {
            title: "Wastewater Treatment",
            description: "Wastewater treatment plants produce H2S gas during the breakdown of organic matter.",
            icon: "💨",
        },
    ]

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 mt-30 px-4 py-15 md:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto max-w-6xl"
            >
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
                        Sources of Hydrogen Sulphide Gas
                    </h1>
                    <p className="mx-auto max-w-3xl text-base text-slate-700 md:text-lg leading-relaxed">
                        Hydrogen sulphide gas is produced naturally from decaying organic matter and industrial processes, and can
                        be lethal in high concentrations. Following are some of its potential sources:
                    </p>
                </div>

                {/* Natural Sources Section */}
                <section className="mb-16">
                    <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">Natural Sources</h2>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                        {naturalSources.map((source) => (
                            <SourceCard key={source.title} {...source} />
                        ))}
                    </div>
                </section>

                {/* Industrial Sources Section */}
                <section>
                    <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">Industrial Sources</h2>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                        {industrialSources.map((source) => (
                            <SourceCard key={source.title} {...source} />
                        ))}
                    </div>
                </section>
            </motion.div>
        </main>
    )
}

export default Source


interface SourceCardProps {
    title: string
    description: string
    icon: string
}

function SourceCard({ title, description, icon }: SourceCardProps) {
    return (
        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
            {/* Icon */}
            <div className="mb-4 text-4xl">{icon}</div>

            {/* Title */}
            <h3 className="mb-3 text-lg font-bold text-slate-900">{title}</h3>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
        </div>
    )
}
