'use client'

import { motion } from 'motion/react'

import { Card } from '@/components/ui/card'

const Knowledege = () => {
    return (
        <section>
            <main className='mx-auto max-w-6xl'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >

                    <div className='py-10 text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-3xl font-semibold md:text-6xl text-black py-5 "
                        >
                            {`Humidity levels and what do they mean?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                            Healthy or ideal indoor relative humid levels should be between 30-60%
                        </motion.span>

                        <div
                            className="hidden lg:block p-2"
                        >
                            <Card className="overflow-hidden p-4 mt-5">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="grid grid-cols-2 gap-0 divide-x"
                                >
                                    {/* Levels Column */}
                                    <div className="p-6">
                                        <h2 className="mb-4 text-2xl font-bold text-slate-900">What does it mean?</h2>
                                        <div className="space-y-3 flex items-start flex-col">
                                            {data.map((item) => (
                                                <div key={item.label} className="py-6 text-lg font-medium text-slate-700 flex items-center justify-center">
                                                    {item.range}
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    {/* What does it mean? Column */}
                                    <div className="p-6">
                                        <h2 className="mb-4 text-2xl font-bold text-slate-900">What does it mean?</h2>
                                        <div className="space-y-3 ">
                                            {data.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className={`${item.color} rounded-lg px-4 py-2 text-center text-lg font-semibold text-white`}
                                                >
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </Card>
                        </div>

                        {/* Responsive Card Layout - Visible on mobile and tablet */}
                        <div className="lg:hidden space-y-4 p-2 mt-5">
                            {data.map((item) => (
                                <Card key={item.label} className="overflow-hidden">
                                    <div className="p-4 sm:p-6">
                                        <div className="mb-3 flex items-baseline justify-between gap-4 text-center">

                                            <span className="text-sm  font-medium text-slate-600">{item.range}</span>
                                        </div>
                                        <div
                                            className={`${item.color} rounded-lg px-4 py-3 text-center text-sm sm:text-base font-semibold text-white`}
                                        >
                                            {item.label}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Knowledege


const data = [
    { label: "Dust mites, the most common dust allergens for asthma, thrive when relative humid level is at or above 70.", range: "= 70%", color: "bg-green-500", className: "bg-green-500" },
    { label: "Ideal relative humidity indoors.", range: "30-60%", color: "bg-yellow-400", className: "bg-yellow-400" },
    { label: "Low relative humid level. Increases the chances of catching airborne viruses. Eye, nose, and throat dryness.", range: ">30%", color: "bg-orange-500", className: "bg-orange-500" }
]