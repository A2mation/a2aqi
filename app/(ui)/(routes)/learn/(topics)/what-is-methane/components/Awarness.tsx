'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, Flame, Brain, Wind } from 'lucide-react'

interface MethanSource {
    id: string
    title: string
    description: string
    icon: string
}

const MethaneSourceCard = ({ title, description, icon }: Omit<MethanSource, 'id'>) => (
    <div className="flex flex-col items-center text-center">
        <div className="mb-4 h-24 w-24 flex items-center justify-center">
            <img
                src={icon}
                alt="Icons"
                width={200}
                height={200}
            />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-blue-600">{title}</h3>
        <p className="text-gray-600 text-base md:text-xl leading-relaxed">{description}</p>
    </div>
)


const Awarness = () => {
    const sources: MethanSource[] = [
        {
            id: 'Dizziness',
            title: 'Dizziness',
            description:
                'Methane can cause dizziness, which may be accompanied by a headache.',
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdbkS2sV1EEMzue3Wyp_2iXzqHHOy0o4-Kw&s",
        },
        {
            id: 'Nausea',
            title: 'Nausea and vomiting',
            description:
                'Methane exposure can cause nausea and vomiting, especially if the exposure was through inhalation.',
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPPadMdj2SyPiJZh7lHZEz8-pjDh6gRlm5aA&s",
        },
        {
            id: 'Breathing',
            title: 'Breathing difficulties',
            description:
                'Methane can displace oxygen in enclosed spaces, leading to a shortage of oxygen and difficulty breathing.',
            icon: "https://wp02-media.cdn.ihealthspot.com/wp-content/uploads/sites/522/2024/03/Asthma-Patient.jpg",
        },
        {
            id: 'Confusion',
            title: 'Confusion',
            description:
                'Methane can affect the central nervous system, leading to confusion and disorientation.',
            icon: "https://healthy.thewom.it/content/uploads/sites/5/2017/12/confusione.jpg",
        },
        {
            id: 'Weakness',
            title: 'Weakness and fatigue',
            description:
                'Methane exposure can cause weakness and fatigue, which may be accompanied by changes in heart rate and blood pressure.',
            icon: "https://cms.patrika.com/wp-content/uploads/2021/06/08/weakness_problem.jpg?w=400",
        },
        {
            id: 'ChestPain',
            title: 'Chest pain or tightness',
            description:
                'Methane exposure can cause chest pain or tightness, especially if the exposure was through inhalation.',
            icon: "https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/07/GettyImages-1169059199_header-1024x575.jpg?w=1155&h=1528",
        },
    ]

    const hazards = [
        {
            id: 1,
            title: 'Asphyxiation',
            description:
                'Methane is an odorless and tasteless gas that can displace oxygen in enclosed spaces, leading to asphyxiation and death.',
            icon: AlertCircle,
        },
        {
            id: 2,
            title: 'Explosive risk',
            description:
                'Methane is highly flammable and can easily ignite, presenting an explosive risk in enclosed spaces where concentrations of the gas are high.',
            icon: Flame,
        },
        {
            id: 3,
            title: 'Neurological effects',
            description:
                'Methane can cause headaches, dizziness, and nausea if inhaled in high concentrations. Long-term exposure to low levels of methane can also affect the central nervous system.',
            icon: Brain,
        },
        {
            id: 4,
            title: 'Respiratory irritation',
            description:
                'Inhaling high concentrations of methane can irritate the eyes, nose, and throat and cause respiratory symptoms such as coughing and wheezing.',
            icon: Wind,
        },
    ]

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        How to know that you have <span className="text-blue-600">Methane (CH4) poisoning?</span>
                    </h1>
                    <div className="mt-4 sm:mt-6 h-1 w-16 bg-gray-300 rounded"></div>
                </div>

                {/* Intro Text */}
                <p className="mb-12 sm:mb-16 text-base sm:text-xl text-blue-600 leading-relaxed max-w-3xl">
                    Methane poisoning can cause a range of symptoms, but not all symptoms are present in every case. If you are someone who works with methane gas on a regular basis, look out for the following symptoms to know if you have methane poisoning or not. Here are some signs and symptoms that may indicate methane poisoning:
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                    {sources.map((source) => (
                        <MethaneSourceCard
                            key={source.id}
                            title={source.title}
                            description={source.description}
                            icon={source.icon}
                        />
                    ))}
                </div>
            </div>
            <section className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 my-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-[#5B7AC6]">Health hazards of</span>{' '}
                        <span className="text-foreground">Methane (CH₄) poisoning</span>
                    </h1>

                    <div className="w-full h-px bg-border mb-8" />

                    <p className="text-base sm:text-xg text-muted-foreground max-w-3xl leading-relaxed">
                        Methane is a highly flammable gas that can pose serious health hazards if it accumulates in enclosed spaces or if it is ingested or inhaled. Some of the health hazards associated with methane poisoning include:
                    </p>
                </div>
            </section>

            {/* Hazards Grid Section */}
            <section className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 ">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {hazards.map((hazard) => {
                            const Icon = hazard.icon
                            return (
                                <Card
                                    key={hazard.id}
                                    className="p-6 flex flex-col items-center text-center bg-muted hover:shadow-lg transition-shadow"
                                >
                                    <div className="mb-4 p-3 bg-background rounded-lg">
                                        <Icon className="w-12 h-12 text-[#5B7AC6]" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                                        {hazard.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                        {hazard.description}
                                    </p>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="text-5xl sm:text-6xl font-light text-muted-foreground leading-none">
                            "
                        </div>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-2">
                            It is important to properly ventilate enclosed spaces where methane may be present and to take appropriate safety measures to avoid exposure to the gas. If you suspect methane poisoning, it is important to seek medical attention immediately.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Awarness

