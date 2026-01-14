'use client'

import { Card } from '@/components/ui/card'
import { motion } from 'motion/react'

const AmmoniaConcentration = () => {
  const data = [
    { level: "Good", range: "0-200", effect: "Air is good to inhale", color: "bg-green-500" },
    {
      level: "Satisfactory",
      range: "201-400",
      effect: "Irritation in the eyes and respiratory tract",
      color: "bg-green-400",
    },
    {
      level: "Moderate",
      range: "401-800",
      effect: "Skin and mouth irritation can be experienced",
      color: "bg-yellow-400",
    },
    {
      level: "Poor",
      range: "801-1200",
      effect: "Exposures can cause skin, eyes, and respiratory tract burns",
      color: "bg-orange-500",
    },
    { level: "Very poor", range: "1200-1800", effect: "30-minute exposure can be fatal", color: "bg-red-500" },
    { level: "Severe", range: "1800+", effect: "Can result in rapid Respiratory Arrest", color: "bg-red-600" },
  ]

  return (
    <main className="  p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900"
          >
            Ammonia concentrations <span className="text-cyan-500">and Health Affects</span>
          </motion.h1>
        </div>

        {/* Desktop Table - Hidden on mobile and tablet */}
        <div
          className="hidden lg:block"
        >
          <Card className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-3 gap-0 divide-x"
            >
              {/* Levels Column */}
              <div className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Levels</h2>
                <div className="space-y-3">
                  {data.map((item) => (
                    <div key={item.level} className="py-2 text-lg font-medium text-slate-700">
                      {item.level}
                    </div>
                  ))}
                </div>
              </div>

              {/* Range Column */}
              <div className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">(μg/m³)</h2>
                <div className="space-y-3">
                  {data.map((item) => (
                    <div key={item.level} className="py-2 text-lg font-medium text-slate-700">
                      {item.range}
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Effects Column */}
              <div className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Health Effects</h2>
                <div className="space-y-3">
                  {data.map((item) => (
                    <div
                      key={item.level}
                      className={`${item.color} rounded-lg px-4 py-2 text-center text-lg font-semibold text-white`}
                    >
                      {item.effect}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Card>
        </div>

        {/* Responsive Card Layout - Visible on mobile and tablet */}
        <div className="lg:hidden space-y-4">
          {data.map((item) => (
            <Card key={item.level} className="overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{item.level}</h3>
                  <span className="text-sm font-medium text-slate-600">{item.range} μg/m³</span>
                </div>
                <div
                  className={`${item.color} rounded-lg px-4 py-3 text-center text-sm sm:text-base font-semibold text-white`}
                >
                  {item.effect}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs sm:text-sm text-slate-600 italic">
          *NAQI as per CBCB. 2-h hourly average values.
        </div>
      </div>
    </main>
  )
}

export default AmmoniaConcentration
