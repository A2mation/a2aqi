'use client'

import { motion } from 'motion/react'

const HealthHazards = () => {
    return (
        <section className='max-w-7xl mx-auto p-2 my-20'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex gap-2 text-4xl md:text-5xl font-bold mb-5 px-2 flex-wrap justify-center"
            >
                <span className="text-blue-400">
                    Hydrogen Sulfide
                </span>
                in the Environment
            </motion.div>



            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-neutral-600 dark:text-neutral-400 py-5 my-5"
            >
                H2S is extremely hazardous for workers, laborers, miners, etc. that have to work with this gas continuously, on a regular basis. It is a highly flammable gas and can react with steel at ambient temperature. This makes handling, storage, transportation, and working with the gas very laborious and demanding.

            </motion.span>


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-6xl mx-auto my-10"
            >
                <H2STable />
            </motion.div>


        </section>
    )
}

export default HealthHazards



function H2STable() {
    const data = [
        {
            ppm: "10",
            color: "bg-green-500",
            textColor: "text-white",
            exposures: [
                { duration: "15 min", effect: "-" },
                { duration: ">15 min", effect: "-" },
                { duration: ">1h-4h", effect: "Eye irritation" },
                { duration: ">4-8ht", effect: "Maximum tolerable concentration for prolonged exposure" },
            ],
        },
        {
            ppm: "50-100",
            color: "bg-green-600",
            textColor: "text-white",
            exposures: [
                { duration: "15 min", effect: "Loss of olfactory perception" },
                { duration: ">15 min", effect: "Eye irritation" },
                { duration: ">1h-4h", effect: "Eye and bronchial irritation" },
                { duration: ">4-8ht", effect: "Serious respiratory distress and asthenia" },
            ],
        },
        {
            ppm: "150-250",
            color: "bg-yellow-400",
            textColor: "text-gray-800",
            exposures: [
                { duration: "15 min", effect: "Eye and skin irritation" },
                { duration: ">15 min", effect: "Eye and bronchial irritation" },
                { duration: ">1h-4h", effect: "Serious respiratory distress and asthenia" },
                { duration: ">4-8ht", effect: "Danger in case of continuous exposure" },
            ],
        },
        {
            ppm: "300-400",
            color: "bg-orange-500",
            textColor: "text-white",
            exposures: [
                { duration: "15 min", effect: "Loss of olfactory perception eye" },
                { duration: ">15 min", effect: "Severe respiratory distress acute asthenia" },
                { duration: ">1h-4h", effect: "Pulmonary edema & risk of death" },
                { duration: ">4-8ht", effect: "Pulmonary edema & risk of death" },
            ],
        },
        {
            ppm: "500-1,000",
            color: "bg-red-600",
            textColor: "text-white",
            exposures: [
                { duration: "15 min", effect: "Loss of consciousness respiratory distress" },
                { duration: ">15 min", effect: "Risk of pulmonary edema and death" },
                { duration: ">1h-4h", effect: "-" },
                { duration: ">4-8ht", effect: "-" },
            ],
        },
        {
            ppm: ">1,000",
            color: "bg-red-700",
            textColor: "text-white",
            exposures: [{ duration: "All", effect: "Immediate loss of consciousness and respiratory distress" }],
        },
    ]

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6 text-foreground">H₂S Exposure Effects Chart</h1>
            <p className="text-sm text-muted-foreground mb-6">*As per BUREAU OF INDIAN STANDARDS</p>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="bg-cyan-400 text-white font-bold px-4 py-3 text-left border border-gray-300 min-w-24">
                                H₂S levels (PPM)
                            </th>
                            <th colSpan={4} className="bg-cyan-400 text-white font-bold px-4 py-3 text-center border border-gray-300">
                                Duration of exposure
                            </th>
                        </tr>
                        <tr>
                            <th className="bg-amber-50 border border-gray-300"></th>
                            <th className="bg-amber-50 border border-gray-300 px-4 py-2 font-semibold text-gray-700">15 min</th>
                            <th className="bg-amber-50 border border-gray-300 px-4 py-2 font-semibold text-gray-700">{">"}15 min</th>
                            <th className="bg-amber-50 border border-gray-300 px-4 py-2 font-semibold text-gray-700">{">"}1h-4h</th>
                            <th className="bg-amber-50 border border-gray-300 px-4 py-2 font-semibold text-gray-700">{">"}4-8ht</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                <td className={`${row.color} ${row.textColor} font-bold px-4 py-3 border border-gray-300 min-w-24`}>
                                    {row.ppm}
                                </td>
                                {row.ppm === ">1,000" ? (
                                    <td colSpan={4} className={`${row.color} ${row.textColor} px-4 py-3 border border-gray-300`}>
                                        {row.exposures[0].effect}
                                    </td>
                                ) : (
                                    row.exposures.map((exp, expIdx) => (
                                        <td key={expIdx} className={`${row.color} ${row.textColor} px-4 py-3 border border-gray-300`}>
                                            {exp.effect}
                                        </td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {data.map((row, idx) => (
                    <div key={idx} className={`${row.color} ${row.textColor} rounded-lg overflow-hidden border border-gray-300`}>
                        <div className="font-bold text-lg px-4 py-3 border-b border-gray-300">{row.ppm} PPM</div>
                        {row.ppm === ">1,000" ? (
                            <div className="px-4 py-3 text-sm">
                                <p className="font-semibold mb-2">All durations:</p>
                                <p>{row.exposures[0].effect}</p>
                            </div>
                        ) : (
                            <div className="px-4 py-3 space-y-3">
                                {row.exposures.map((exp, expIdx) => (
                                    <div key={expIdx}>
                                        <p className="font-semibold text-sm opacity-90">{exp.duration}</p>
                                        <p className="text-sm">{exp.effect}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6">*As per BUREAU OF INDIAN STANDARDS</p>
        </div>
    )
}
