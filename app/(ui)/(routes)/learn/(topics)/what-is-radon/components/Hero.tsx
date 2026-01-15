"use client"

import { motion } from 'motion/react'

const Hero = () => {
    return (
        <section className='bg-[#028b7b]'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <img
                        src={"https://www.pranaair.com/blog/wp-content/uploads/2022/10/radon-rn-300x300.jpg"}
                        width={100}
                        height={100}
                        alt="Picture of the author"
                    />

                    <div className='py-10 max-w-3xl mx-auto text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-3xl font-semibold md:text-6xl text-white py-5 "
                        >
                            {`What is Radon (Rn)?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl  text-white"
                        >
                            Radon (Rn) is a naturally occurring radioactive gas that is formed by the decay of radium, which is found in most soils. Radon can be found in the atmosphere outdoors. But it is not a health concern as it rapidly dilutes in the atmosphere to very low levels. It is a health concern indoors where this dilution is not possible and the air is not disturbed.
                        </motion.span>

                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="heading-xl text-xl md:text-3xl font-semibold text-white py-5"
                        >
                            {`Radon, Radioactivity, and its decayed products`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className=" text-base lg:text-xl text-white "
                        >
                            As radon decays, it emits a form of radiation known as alpha particles. These radon changes into other radioactive elements known as decay products. Hence, Radon and its decay products enter your lungs while you breathe. As a result, all of the lung cells can damage. Over time, radon exposure damages more and more cells, increasing the likelihood that one of the cells will develop cancer.
                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
