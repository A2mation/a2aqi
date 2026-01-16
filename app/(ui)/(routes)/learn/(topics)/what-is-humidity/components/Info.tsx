import type React from "react"
import {
    Wind,
    Thermometer,
    CloudRain,
    Droplets,
    Flame,
    Waves,
    Wind as Wind2,
    Pipette,
    Shirt,
    Droplet,
} from "lucide-react"

const Info = () => {
    return (
        <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-bold text-center mb-12 text-balance">
                    Factors that affect Humidity Level Indoor & Outdoor
                </h1>

                {/* Factors Grid */}
                <div className="grid grid-cols-1  md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Outdoors Section */}
                    <div className="space-y-8">
                        <h2 className="text-4xl font-semibold text-foreground text-center mb-6">Outdoors Environment</h2>
                        <div className="space-y-6">
                            {outdoorFactors.map((factor, index) => (
                                <FactorCard key={index} factor={factor} />
                            ))}
                        </div>
                    </div>

                    {/* Indoors Section */}
                    <div className="space-y-8">
                        <h2 className="text-4xl font-semibold text-center text-foreground mb-6">Indoor Environment</h2>
                        <div className="space-y-6">
                            {indoorFactors.map((factor, index) => (
                                <FactorCard key={index} factor={factor} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info




interface FactorItem {
    title: string
    description: string
    icon: React.ReactNode
}

const outdoorFactors: FactorItem[] = [
    {
        title: "Air Movement",
        description:
            "Higher wind speeds result in less water evaporation and lowers it, while lower wind speeds result in more evaporation & higher humidity.",
        icon: <Wind className="size-12 text-sky-500" />,
    },
    {
        title: "Temperature",
        description:
            "The air can store more water vapour when the temperature increases, hence a warmer atmosphere may have a higher level of it.",
        icon: <Thermometer className="size-12 text-sky-500" />,
    },
    {
        title: "Wind Speed",
        description:
            "Lower wind speeds result in more water evaporation & higher humidity, while higher wind speeds result in less evaporation & lower its level.",
        icon: <Wind2 className="size-12 text-sky-500" />,
    },
    {
        title: "Precipitation",
        description: "Its level will rise the longer it rains because the air is constantly absorbing water.",
        icon: <CloudRain className="size-12 text-sky-500" />,
    },
    {
        title: "Air Pressure",
        description:
            "It depends on the atmospheric pressures at different geographical locations, temperature, and air pressure in the respective area.",
        icon: <Droplets className="size-12 text-sky-500" />,
    },
]

const indoorFactors: FactorItem[] = [
    {
        title: "Cooking or boiling water",
        description:
            "Cooking and water boiling activities release water vapour in the air. This will add to the relative level of that room.",
        icon: <Flame className="size-12 text-sky-500" />,
    },
    {
        title: "Appliances such as Gas Heaters",
        description: "One litre of moisture is produced every hour while using a non-fueled gas heater.",
        icon: <Waves className="size-12 text-sky-500" />,
    },
    {
        title: "Ventilation Rate",
        description:
            "Its high level indicates inadequate ventilation. Extremely high indoor humidity is linked to an increase in the development of bacteria and mould.",
        icon: <Pipette className="size-12 text-sky-500" />,
    },
    {
        title: "Drying the clothes indoors",
        description:
            "Drying the clothes indoors can increase its relative level in a room and therefore will increase the risks of mould and bacteria growth.",
        icon: <Shirt className="size-12 text-sky-500" />,
    },
    {
        title: "Water leakages",
        description:
            "Water leakages can increase both moisture & humidity. As a result, the air will become stale & the chances of getting sick due to bacteria will increase.",
        icon: <Droplet className="size-12 text-sky-500" />,
    },
]

function FactorCard({ factor }: { factor: FactorItem }) {
    return (
        <div className="flex gap-4 sm:gap-6 group">
            {/* Icon Container */}
            <div className="flex-shrink-0 pt-1">{factor.icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-2xl font-semibold text-sky-500 mb-2">{factor.title}</h3>
                <p className="text-sm sm:text-xl text-muted-foreground leading-relaxed">{factor.description}</p>
            </div>
        </div>
    )
}
