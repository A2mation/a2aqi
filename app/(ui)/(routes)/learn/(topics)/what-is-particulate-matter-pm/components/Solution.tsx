'use client'

import { motion } from "motion/react"

const Solution = () => {
    return (

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
                        {`How to reduce Particulate Matter (PM) exposure?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        PM can be present in both indoor and outdoor environments. So, you can easily monitor the PM levels in both environments using a PM air quality monitor.
                    </motion.span>

                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-xl font-semibold md:text-3xl text-black py-5 "
                    >
                        {`Indoor solution`}
                    </motion.h2>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        PM (Particulate Matter) can be easily monitored indoors. After the monitoring, if the levels exceed the limits so the proper measures can be taken to reduce the levels.
                    </motion.span>


                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-xl font-semibold md:text-3xl text-black py-5 "
                    >
                        {`Outdoor Solution`}
                    </motion.h2>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        We have a variety of outdoor air quality monitors that can measure the PM levels outdoors. As, when the levels exceed the limits, you can wear anti-pollution N-95 mask. As to prevent you from various hazards that can be caused to the PM / dust exposure.
                    </motion.span>


                </div>

            </div>
        </main>

    )
}

export default Solution
