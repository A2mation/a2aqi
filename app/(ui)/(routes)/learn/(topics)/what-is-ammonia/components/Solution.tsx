'use client'
import { AlertTriangle } from "lucide-react"
import { motion } from "motion/react"


const Solution = () => {
    return (
        <main>
            <SafetyInfographic />
        </main>
    )
}

export default Solution


function SafetyInfographic() {
    const cards = [
        {
            id: 1,
            title: "Personal protective equipment (PPE)",
            description:
                "Workers handling ammonia gas should wear appropriate PPE, such as respirators, goggles, gloves, and protective clothing, to prevent exposure.",
            icon: "user-protection",
        },
        {
            id: 2,
            title: "Proper ventilation",
            description:
                "Facilities handling ammonia gas should have proper ventilation systems to prevent the buildup of hazardous concentrations of ammonia gas in the air.",
            icon: "ventilation",
        },
        {
            id: 3,
            title: "Transportation regulations",
            description:
                "Ammonia gas is considered a hazardous material for transportation, and specific regulations apply to its transport by road, rail, or sea.",
            icon: "transportation",
        },
        {
            id: 4,
            title: "Inspection and maintenance",
            description:
                "Equipment and facilities handling ammonia gas should be regularly inspected and maintained to prevent leaks or other safety hazards.",
            icon: "inspection",
        },
        {
            id: 5,
            title: "Emergency response plans",
            description:
                "Facilities must have emergency plans for ammonia gas incidents. Workers need training and access to gas masks, air supply systems, and emergency showers.",
            icon: "emergency",
        },
        {
            id: 6,
            title: "Regulatory compliance",
            description:
                "Facilities handling ammonia gas must comply with relevant safety regulations and standards, such as those set by OSHA, EPA, or local authorities.",
            icon: "compliance",
        },
    ]

    return (
        <div className="w-full  py-8 md:py-16 px-4 md:px-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-6xl mx-auto mb-12 md:mb-20"
            >
                <h1 className="text-center text-2xl md:text-4xl font-bold mb-4">
                    Safety <span className="text-cyan-500">Regulations</span> and{" "}
                    <span className="text-cyan-500">guidelines</span> for handling{" "}
                    <span className="text-cyan-500">Ammonia gas</span> in different industries
                </h1>
                <p className="text-center text-sm md:text-base text-slate-600 mt-6">
                    Some common safety regulations and guidelines include:
                </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="max-w-6xl mx-auto mb-12 md:mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            {/* Icon */}
                            <div className="w-32 h-32 md:w-40 md:h-40 mb-6 flex items-center justify-center bg-blue-100 rounded-lg">
                                <IconComponent iconType={card.icon} />
                            </div>

                            {/* Content */}
                            <h3 className="text-center font-bold text-lg md:text-xl mb-3 text-slate-800">{card.title}</h3>
                            <p className="text-center text-sm md:text-base text-slate-600 leading-relaxed">{card.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer Note */}
            <div className="max-w-6xl mx-auto">
                <div className="flex gap-3 items-start bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200">
                    <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-slate-700">
                        <span className="font-semibold">
                            Overall, safety regulations and guidelines for handling ammonia gas are essential to prevent accidents,
                            protect workers and the public, and ensure compliance with environmental and safety regulations.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

interface IconComponentProps {
    iconType: string
}

function IconComponent({ iconType }: IconComponentProps) {
    switch (iconType) {
        case "user-protection":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <circle cx="50" cy="25" r="12" fill="#3B82F6" />
                    <path d="M 35 40 L 35 55 Q 35 65 50 70 Q 65 65 65 55 L 65 40 Z" fill="#3B82F6" />
                    <circle cx="30" cy="50" r="4" fill="#06B6D4" />
                    <circle cx="70" cy="50" r="4" fill="#06B6D4" />
                    <circle cx="50" cy="80" r="3" fill="#3B82F6" />
                </svg>
            )
        case "ventilation":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <rect x="25" y="20" width="50" height="60" rx="8" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="2" />
                    <path d="M 40 35 Q 50 45 40 55" stroke="#06B6D4" strokeWidth="2" fill="none" />
                    <path d="M 60 35 Q 50 45 60 55" stroke="#06B6D4" strokeWidth="2" fill="none" />
                    <circle cx="50" cy="70" r="3" fill="#3B82F6" />
                </svg>
            )
        case "transportation":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <rect x="20" y="40" width="60" height="35" rx="4" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="2" />
                    <circle cx="35" cy="75" r="6" fill="#3B82F6" />
                    <circle cx="65" cy="75" r="6" fill="#3B82F6" />
                    <rect x="45" y="30" width="10" height="12" fill="#3B82F6" />
                    <path d="M 25 45 L 30 35 L 75 35 L 80 45" fill="#06B6D4" />
                </svg>
            )
        case "inspection":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <g fill="#E0F2FE" stroke="#3B82F6" strokeWidth="1.5">
                        <rect x="25" y="25" width="15" height="20" />
                        <rect x="45" y="30" width="15" height="35" />
                        <rect x="65" y="35" width="12" height="30" />
                    </g>
                    <circle cx="30" cy="65" r="8" fill="none" stroke="#06B6D4" strokeWidth="2" />
                    <path d="M 25 60 L 30 65 L 35 60" stroke="#06B6D4" strokeWidth="2" fill="none" />
                </svg>
            )
        case "emergency":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <path
                        d="M 50 15 L 65 45 L 95 45 L 72 62 L 82 92 L 50 75 L 18 92 L 28 62 L 5 45 L 35 45 Z"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                    />
                    <path d="M 50 35 L 50 60" stroke="#06B6D4" strokeWidth="2" />
                    <circle cx="50" cy="70" r="2" fill="#06B6D4" />
                </svg>
            )
        case "compliance":
            return (
                <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-32 md:h-32" fill="none">
                    <rect x="30" y="20" width="40" height="55" rx="4" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="2" />
                    <line x1="35" y1="30" x2="65" y2="30" stroke="#3B82F6" strokeWidth="1" />
                    <line x1="35" y1="40" x2="65" y2="40" stroke="#3B82F6" strokeWidth="1" />
                    <line x1="35" y1="50" x2="65" y2="50" stroke="#3B82F6" strokeWidth="1" />
                    <path d="M 45 60 L 50 65 L 58 55" stroke="#06B6D4" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
            )
        default:
            return null
    }
}
