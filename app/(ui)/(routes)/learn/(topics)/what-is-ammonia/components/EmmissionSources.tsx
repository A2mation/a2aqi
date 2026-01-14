"use client"

export const metadata = {
  title: "Ammonia Emissions | Main Sources",
  description:
    "Learn about the main sources of ammonia emissions including vehicles, agriculture, industries, and more.",
}

const EmmissionSources = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-cyan-50 to-cyan-100 py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
          <span className="text-slate-800">Ammonia (NH₃)</span>
          <span className="text-cyan-600 font-semibold"> : Main Emission Sources</span>
        </h1>

        <p className="text-center text-slate-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          Cooking, tobacco smoke, burning fuels and kerosene, mold, air fresheners, nail polish removers, pet dander,
          and many more. When there is no circulation of air and indoor air trapped inside, CO2 levels will rise.
        </p>
      </div>

      {/* Emission Sources Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {emissionSources.map((source) => (
            <div
              key={source.id}
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-lg transition-transform hover:scale-105"
            >
              {/* Icon placeholder */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center text-4xl sm:text-5xl">
                {source.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">{source.title}</h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">{source.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default EmmissionSources


const emissionSources = [
  {
    id: 1,
    title: "Vehicle emissions",
    description:
      "Gasoline burning produces ammonia in the air by 0.30–0.47 g/kg. Whereas diesel burning contributes 0.34–0.50 g/kg.",
    icon: "🚗",
  },
  {
    id: 2,
    title: "Agricultural activities",
    description:
      "Chemical fertilizers, slurries, and synthetic manures carry ammonia, hence farmers are at a high risk of ammonia exposure.",
    icon: "🌾",
  },
  {
    id: 3,
    title: "Industries",
    description:
      "Ammonia is used in various manufacturing processes such as fertilizer industries, urea manufacturing industries, and many more.",
    icon: "🏭",
  },
  {
    id: 4,
    title: "Household emissions",
    description:
      "Sources such as cooking, cleaning agents, metabolic activities, and smoking can all contribute to household ammonia emitters.",
    icon: "🏠",
  },
  {
    id: 5,
    title: "Sewage Treatment plants",
    description:
      "Processing of sewage waste can produce a high amount of ammonia. If not monitored and controlled, it can be fatal.",
    icon: "💧",
  },
  {
    id: 6,
    title: "Building materials",
    description:
      "Cement concretes that are used to build houses release ammonia. Paint and solvents also have traces of ammonia gas.",
    icon: "🏗️",
  },
]


