'use client'

import { motion } from "motion/react"

const Source = () => {
    return (
        <main className='mx-auto max-w-7xl'>
            <div
                className='flex items-center justify-center flex-col px-10 py-20'
            >
                <div className=' text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-2xl font-semibold md:text-5xl text-black py-5 "
                    >
                        {`Where does Particulate Matter (PM) come from and its main sources?`}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        1. Primary particulate matter (PM) is directly released into the atmosphere. Because, they are produced by a multitude of sources, including cars, trucks, buses, factories, building sites, replanted fields, dirt roads, rock crushers, and wood burning.
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl mt-2 text-black"
                    >
                        2. Secondary particles may generate in the air as a result of gas chemical changes. Since, they are generated indirectly when gases emitted by burning fuels combine with sunlight and water vapor. Also, these can produce by the combustion of gasoline in automobiles, power plants, and other industrial activities.
                    </motion.div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-center my-12 text-foreground">
                    PM - Air Quality Guidelines
                </h1>

                {/* Guidelines Table */}
                <div className="mb-16 border border-border rounded-lg overflow-hidden bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-green-100 border-b border-border">
                                    <th className="px-4 py-3 text-left font-semibold text-lg md:text-2xl"></th>
                                    <th colSpan={2} className="px-4 py-3 text-center font-semibold text-lg md:text-2xl border-r border-border">
                                        PM2.5 (µg/m³)
                                    </th>
                                    <th colSpan={2} className="px-4 py-3 text-center font-semibold text-lg md:text-2xl">
                                        PM10 (µg/m³)
                                    </th>
                                </tr>
                                <tr className="bg-green-100 border-b border-border">
                                    <th className="px-4 py-3 text-left font-semibold text-sm"></th>
                                    <th className="px-4 py-3 text-center font-semibold text-sm border-r border-border">Annual</th>
                                    <th className="px-4 py-3 text-center font-semibold text-sm border-r border-border">24hrs</th>
                                    <th className="px-4 py-3 text-center font-semibold text-sm border-r border-border">Annual</th>
                                    <th className="px-4 py-3 text-center font-semibold text-sm">24hrs</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {guidelines.map((guideline, index) => (
                                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-lg md:text-2xl bg-green-50 border-r border-border">
                                            {guideline.organization}
                                        </td>
                                        <td className="px-4 py-3 text-center text-lg md:text-2xl bg-green-50 border-r border-border">
                                            {guideline.pm25Annual}
                                        </td>
                                        <td className="px-4 py-3 text-center text-lg md:text-2xl bg-green-50 border-r border-border">
                                            {guideline.pm2524hrs}
                                        </td>
                                        <td className="px-4 py-3 text-center text-lg md:text-2xl bg-green-50 border-r border-border">
                                            {guideline.pm10Annual}
                                        </td>
                                        <td className="px-4 py-3 text-center text-lg md:text-2xl bg-green-50">
                                            {guideline.pm1024hrs}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Information Section */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
                        What level of Particulate Matter (PM) is unhealthy?
                    </h2>
                    <p className="text-base md:text-2xl text-foreground leading-relaxed text-center max-w-5xl mx-auto mb-8">
                        Most studies show that PM2.5 levels of <span className="font-semibold">12 µg/m3 or below</span> are deemed healthy, with little to no danger from exposure. But, if the quantity reaches or exceeds <span className="font-semibold">35 µg/m3 in 24 hours</span>, the air is classified as hazardous. Hence, it might create problems for persons who already have breathing problems, such as asthma. Moreover, prolonged exposure to levels exceeding <span className="font-semibold">50 µg/m3</span> can result in major health problems and untimely death.
                    </p>
                </div>

                {/* AQI Scale */}
                <div className="border border-border rounded-lg p-6 md:p-8 bg-card">
                    <h3 className="text-lg md:text-2xl font-bold mb-6 text-foreground">
                        AQI PM 2.5
                    </h3>

                    {/* AQI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aqiLevels.map((level, index) => (
                            <div key={index} className="flex flex-col">
                                <div className={`${level.color} text-white text-lg md:text-2xl font-bold py-3 px-4 text-center rounded-t-lg`}>
                                    {level.range}
                                </div>
                                <div className="border border-t-0 text-lg md:text-2xl border-border py-2 px-4 text-center font-semibold text-foreground rounded-b-lg bg-muted/20">
                                    {level.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Source


const guidelines = [
    { organization: 'Indian (CPCB)', pm25Annual: 40, pm2524hrs: 60, pm10Annual: 60, pm1024hrs: 100 },
    { organization: 'USA (US EPA)', pm25Annual: 15, pm2524hrs: 65, pm10Annual: 50, pm1024hrs: 150 },
    { organization: 'Europe (UK EPA)', pm25Annual: '-', pm2524hrs: '-', pm10Annual: 30, pm1024hrs: 50 },
    { organization: 'WHO', pm25Annual: 10, pm2524hrs: 25, pm10Annual: 20, pm1024hrs: 50 },
];

const aqiLevels = [
    { range: '0-50', label: 'Good', color: 'bg-green-600' },
    { range: '51-100', label: 'Moderate', color: 'bg-yellow-400' },
    { range: '101-200', label: 'Poor', color: 'bg-orange-500' },
    { range: '201-300', label: 'Unhealthy', color: 'bg-red-600' },
    { range: '301-400', label: 'Severe', color: 'bg-purple-600' },
    { range: '401-500', label: 'Hazardous', color: 'bg-black' },
];