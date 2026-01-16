import React from 'react'

const Precaution = () => {
    return (
        <main className="min-h-screen">
            <HumidityGuide />
        </main>
    )
}

export default Precaution


function HumidityGuide() {
    const tips = [
        {
            id: 1,
            title: "Fix any leakages or pipe leaks",
            description:
                "Fix any broken pipes, faucets, and leakages that can result in more moisture and condensation indoors.",
            icon: "🔧",
        },
        {
            id: 2,
            title: "Dry your clothes outside",
            description:
                "It's recommended to dry your laundry outdoors as they can increase the relative humid level of a room if dried indoors.",
            icon: "👕",
        },
        {
            id: 3,
            title: "Relocate your indoor plants",
            description:
                "If the relative humid level of a room is higher and it has plants in that room, consider relocating them as they are a potential source.",
            icon: "🌱",
        },
        {
            id: 4,
            title: "Use Dehumidifiers",
            description:
                "Dehumidifiers will help you reduce the relative humid level of your space if you have high-level problems in your room.",
            icon: "❄️",
        },
        {
            id: 5,
            title: "Use charcoal pieces",
            description:
                "Charcoal is a great absorber. A single piece of charcoal can reduce humid levels in your air. They just need to be replaced every 2-3 months.",
            icon: "⚫",
        },
        {
            id: 6,
            title: "Open windows",
            description:
                "Opening windows in areas with high level of it, such as bathrooms is one of the easy solutions. This will increase ventilation as well.",
            icon: "🪟",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-500 to-cyan-600 px-4 py-8 md:py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-16">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 text-balance">
                        How To Maintain the Good Humidity Indoor?
                    </h1>
                    <p className="text-sm md:text-base lg:text-xl text-cyan-50">
                        Healthy or ideal indoor relative humid levels should be between 30-50%
                    </p>
                </div>

                {/* Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {tips.map((tip) => (
                        <div
                            key={tip.id}
                            className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 hover:bg-white/20 transition-colors duration-300"
                        >
                            {/* Icon Container */}
                            <div className="text-4xl md:text-5xl mb-4">{tip.icon}</div>

                            {/* Title */}
                            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 text-balance">{tip.title}</h2>

                            {/* Description */}
                            <p className="text-sm md:text-xl text-cyan-50 leading-relaxed">{tip.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}