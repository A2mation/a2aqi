"use client"

import { motion } from 'motion/react'

const Intro = () => {
    return (
        <section>
            <section
                className=" h-full max-w-7xl mx-auto lg:h-3/4 mt-25"
            >

                <div
                    className="flex flex-col justify-center items-center w-full"
                >
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
                    <div className="mt-4 w-3/4 mb-10">

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-neutral-600 dark:text-neutral-400 "
                        >
                            Hydrogen Sulfide is produced by bacterial breakage of animal, plant, and human waste. It can be produced by volcanic gases, and natural springs as well. H₂S gas dissolved in the soil helps in the root growth of plants.

                        </motion.span>

                    </div>
                </div>

                <div className="flex items-center justify-center f gap-4 w-full p-2">
                    <img
                        className="h-50 md:h-150 w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"
                        style={{
                            backgroundImage: "url('https://bubbletubing.com/wp-content/uploads/2022/08/formation-of-hydrogen-sulfide-diagram.jpg')",
                        }}
                    />
                </div>


                <div className='mt-20 flex items-center py-5 gap-4 flex-col'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="heading-xl text-2xl md:text-7xl text-blue-400 py-5 "
                    >
                        DO YOU KNOW?
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-lg lg:text-2xl text-neutral-600 max-w-7xl px-4"
                    >
                        The primary target organ of hydrogen sulfide poisoning is the respiratory system. Once inhaled, hydrogen sulfide is quickly absorbed by the lungs. This may result in cardiac arrest or even death since it affects the neurological and cardiac tissues. The most well-known symptom of hydrogen sulfide poisoning is sudden death among sewage workers. All exposures to H₂S should be avoided because they have severe harmful effects. - Saiyed, H N. Indian Journal of Medical Research; New Delhi
                    </motion.span>

                </div>


            </section>
        </section>
    )
}

export default Intro
