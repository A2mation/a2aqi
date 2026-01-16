import type React from "react"
import { Droplets, Wind, Users, Zap, Package, Heart, BarChart3 } from "lucide-react"

const Effects = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <HumidityInfographic />
        </section>
    )
}

export default Effects


interface EffectItem {
    title: string
    description: string
    icon: React.ReactNode
    color: "blue" | "teal" | "cyan"
}

const HighHumidityEffects: EffectItem[] = [
    {
        title: "Encourages Mold & Mildew",
        description:
            "When the relative level is more than 60%, it can promote the growth of mold and mildew. Excess mold in your home is considered very dangerous for humans.",
        icon: <Droplets className="w-full h-full" />,
        color: "blue",
    },
    {
        title: "Virus and bacteria",
        description:
            "When you spend too much time in too humid conditions, it might trigger allergies & make you sick. Because viruses and bacteria thrive in humid conditions which can cause various respiratory illness symptoms.",
        icon: <Zap className="w-full h-full" />,
        color: "blue",
    },
    {
        title: "Excess Sweating",
        description:
            "Humidity means that the air contains water vapor. When the air becomes more humid, people experience excessive sweating. Because the sweat will not evaporate easily. Or it will take more time than usual due to high water vapor in the air.",
        icon: <Wind className="w-full h-full" />,
        color: "blue",
    },
    {
        title: "Increased Respiration",
        description:
            "Due to high temperature, when our bodies heat up naturally, we sweat. That sweat then evaporates to keep our bodies cool. Due to excess moisture in the air, our bodies need to work harder to cool off. This increases blood circulation and respiration.",
        icon: <Heart className="w-full h-full" />,
        color: "blue",
    },
    {
        title: "Damage Your Belongings",
        description:
            "High humidity can damage your furniture, flooring, wallpaper, paintwork, etc. High humidity results in condensation that gather on walls. So the paint will start to flake and the wallpaper will curl up.",
        icon: <Package className="w-full h-full" />,
        color: "blue",
    },
]

const LowHumidityEffects: EffectItem[] = [
    {
        title: "Germs and Viruses",
        description:
            "Due to low humid level, germs & viruses disperse and travel around freely. As a result, they thrive in low humid level, and diseases such as RTIs are more common when relative humidity level is low.",
        icon: <Users className="w-full h-full" />,
        color: "cyan",
    },
    {
        title: "Susceptibility to respiratory diseases",
        description:
            "Normal level and low temperatures result in more susceptibility to catching respiratory diseases, colds, and many other respiratory tract infections like sinusitis, otitis, bronchitis, and pneumonia. This is because low humid level will result in drying out the airways.",
        icon: <Heart className="w-full h-full" />,
        color: "cyan",
    },
    {
        title: "Dry Hair and Dry Skin",
        description:
            "When the air has low humid, skin, and hair do not get enough moisture. As a result, the skin will flake resulting in skin irritation and itching and can worsen skin conditions like eczema and psoriasis. Whereas hair will become more dry, dull, and will break more often.",
        icon: <Droplets className="w-full h-full" />,
        color: "cyan",
    },
    {
        title: "Influenza",
        description:
            "Low relative humidity results in chances of spreading influenza. Low humidity further reduces the ability of cilia (hair-like structures in the airway cells) in removing viruses such as Covid-19 and preventing damage done to the lungs due to such viruses.",
        icon: <Wind className="w-full h-full" />,
        color: "cyan",
    },
    {
        title: "Decreased performance",
        description:
            "Even minor variations in relative humidity and temperature can create measurable changes in your abilities to concentrate or accomplish tasks, especially in places like schools and offices where concentration is extremely important.",
        icon: <BarChart3 className="w-full h-full" />,
        color: "cyan",
    },
]

function HumidityInfographic() {
    return (
        <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    What Happens When Humidity Level Is Very Low & High?
                </h1>
                <p className="text-base md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    The ideal of healthy range of it should be maintained between 30-60%. Because it is unhealthy when it exceeds
                    or is lower than the ideal limit, it causes many discomforts. Hence, it can result in the growth of mold and
                    bacteria.
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* High Humidity Section */}
                <div className="space-y-6 md:space-y-8">
                    <div className="sticky top-8 lg:static">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">When humidity is high</h2>
                        <p className="text-blue-700 font-semibold text-lg">(≥ or = to 60%)</p>
                    </div>

                    {HighHumidityEffects.map((effect, index) => (
                        <EffectCard key={index} effect={effect} />
                    ))}
                </div>

                {/* Low Humidity Section */}
                <div className="space-y-6 md:space-y-8">
                    <div className="sticky top-8 lg:static">
                        <h2 className="text-2xl md:text-3xl font-bold text-cyan-900 mb-2">When humidity is low</h2>
                        <p className="text-cyan-700 font-semibold text-lg">(≥ 30%)</p>
                    </div>

                    {LowHumidityEffects.map((effect, index) => (
                        <EffectCard key={index} effect={effect} />
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-16 md:mt-20 p-6 md:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <p className="text-center text-gray-700 text-sm md:text-base leading-relaxed">
                    💡 <strong>Pro Tip:</strong> Maintain humidity levels between 30-60% for optimal health and comfort in your
                    home or workplace.
                </p>
            </div>
        </div>
    )
}

interface EffectCardProps {
    effect: EffectItem
}

function EffectCard({ effect }: EffectCardProps) {
    const colorClasses = {
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            title: "text-blue-900",
            icon: "text-blue-600",
            accent: "bg-blue-100",
        },
        cyan: {
            bg: "bg-cyan-50",
            border: "border-cyan-200",
            title: "text-cyan-900",
            icon: "text-cyan-600",
            accent: "bg-cyan-100",
        },
        teal: {
            bg: "bg-teal-50",
            border: "border-teal-200",
            title: "text-teal-900",
            icon: "text-teal-600",
            accent: "bg-teal-100",
        },
    }

    const colors = colorClasses[effect.color]

    return (
        <div className={`${colors.bg} ${colors.border} border rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex gap-4 md:gap-5">
                <div
                    className={`${colors.accent} rounded-full p-3 md:p-4 flex-shrink-0 flex items-center justify-center h-fit`}
                >
                    <div className={`${colors.icon} w-6 h-6 md:w-7 md:h-7`}>{effect.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`${colors.title} font-bold text-base md:text-2xl mb-2`}>{effect.title}</h3>
                    <p className="text-gray-700 text-sm md:text-xl leading-relaxed">{effect.description}</p>
                </div>
            </div>
        </div>
    )
}
