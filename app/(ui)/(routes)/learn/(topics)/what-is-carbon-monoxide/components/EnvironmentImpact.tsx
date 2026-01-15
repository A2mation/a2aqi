'use client'

import { motion } from 'motion/react'

const EnvironmentImpact = () => {
    return (
        <section className='bg-[#74698c]'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >


                    <div className='py-10 max-w-3xl mx-auto text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-xl font-semibold md:text-3xl text-white py-5 "
                        >
                            {`Health & Environmental Impacts of Carbon Monoxide (CO) Gas`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-lg  text-white"
                        >
                            CO levels in the atmosphere are generally normal, and they are unlikely to harm you. When these levels rise in an indoor or outdoor setting, various health risks to both people and the environment arise.
                        </motion.span>


                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-xl font-bold md:text-3xl text-white py-5 "
                        >
                            {`Lets find out the harmful effects of carbon monoxide (CO) gas on our health.`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-lg  text-white"
                        >
                            CO is one of the most toxic gases in the environment. Because it harms humans. The most prevalent and harmful health impact is that it interacts with hemoglobin. As by preventing oxygen from reacting with hemoglobin and being transferred to the bodys many organs. Hence, resulting in organ failure.
                        </motion.span>


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-lg  text-white pt-4"
                        >
                            It is especially dangerous for heart patients. Since, it causes a lack of oxygen in the body. Hence, It makes us feel sick, and one of the most common symptoms is vomiting. Furthermore, CO poisoning can also cause the flu. If not treated promptly, it can result in coma and, in rare circumstances, death due to the severe range of effects on the body.
                        </motion.div>


                        <div className='flex items-center justify-center gap-2 p-2 mt-10'>
                            <img
                                src={"https://www.verywellhealth.com/thmb/A0rCc2N6CTX89Y-Q4x8bsJ7HRc8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/VWH-JessicaOlah-CommonSymptomsofCarbonMonoxidePoisoning-Standard-460087eaa2ad4058af35e4606caabe07.jpg"}
                                width={600}
                                height={600}
                                alt="Picture of the CO icon"
                            />

                        </div>

                    </div>

                </div>
            </main>
        </section>
    )
}

export default EnvironmentImpact
