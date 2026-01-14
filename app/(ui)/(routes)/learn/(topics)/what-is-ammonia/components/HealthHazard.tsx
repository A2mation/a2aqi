'use client'

import { motion } from "motion/react"

export const metadata = {
  title: "Health Hazards of Ammonia Poisoning",
  description: "Learn about the health hazards and effects of ammonia gas exposure",
}

const HealthHazard = () => {
  return (
    <main className="min-h-screen bg-background">
      <HealthHazardsHero />
      <HealthHazardsCards />
    </main>
  )
}

export default HealthHazard




function HealthHazardsCards() {
  const hazards = [
    {
      id: 1,
      title: "Skin Irritation",
      description:
        "It can cause skin irritation, including burning and itching, which may lead to rashes and blisters with prolonged exposure.",
      image: "/assets/person-touching-face-skin-irritation.jpg",
      position: "top",
    },
    {
      id: 2,
      title: "Seizures",
      description:
        "High levels of ammonia exposure can lead to poisoning, which can cause symptoms such as confusion, dizziness, and seizures, and can even be fatal in severe cases.",
      image: "/assets/person-experiencing-seizure.jpg",
      position: "top",
    },
    {
      id: 3,
      title: "Long-term breathing issues",
      description:
        "Chronic exposure to low levels of ammonia can also lead to long-term health effects such as chronic bronchitis, asthma, and lung damage.",
      image: "/assets/person-coughing-respiratory.jpg",
      position: "top",
    },
    {
      id: 4,
      title: "Digestive issues",
      description: "Ingestion of ammonia can lead to digestive issues such as nausea, vomiting, and abdominal pain.",
      image: "/assets/person-stomach-pain-digestive.jpg",
      position: "top",
    },
  ]

  return (
    <section className="px-4 py-12 md:py-20 max-w-6xl mx-auto">
      {/* Two column grid for desktop, single column for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {hazards.map((hazard) => (
          <HealthHazardsCard key={hazard.id} {...hazard} />
        ))}
      </div>

      {/* Closing statement */}
      <div className="mt-12 md:mt-16 text-center">
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          It is essential to take proper precautions when handling ammonia to prevent exposure and ensure personal
          safety. This includes wearing protective gear, using proper ventilation, and following safe handling
          procedures.
        </p>
      </div>
    </section>
  )
}

interface HealthHazardsCardProps {
  title: string
  description: string
  image: string
}

function HealthHazardsCard({ title, description, image }: HealthHazardsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex flex-col items-center text-center"
    >
      {/* Image container */}
      <div className="w-full max-w-xs h-40 md:h-48 mb-6 relative flex items-center justify-center">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover rounded-lg" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-sm">{description}</p>
      </div>
    </motion.div>
  )
}

function HealthHazardsHero() {
  return (
    <section className="px-4 py-12 md:py-16 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 text-balance"
        >
          Health Hazards of <span className="text-cyan-500">Ammonia Poisoning</span>
        </motion.h1>

        {/* Introduction paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-foreground/75 mt-6 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          <span className="text-cyan-600 font-medium">Ammonia gas can be bad for health</span> due to its irritant and
          toxic properties. Thus, it is essential to take proper precautions when handling it to prevent exposure and
          ensure personal safety.
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm md:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed"
        >
          Following are some common health hazards one can experience if exposed to ammonia gas:
        </motion.p>
      </div>
    </section>
  )
}
