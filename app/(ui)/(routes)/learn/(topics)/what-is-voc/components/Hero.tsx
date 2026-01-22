'use client'

import { motion } from 'motion/react'
import Image from "next/image"

const Hero = () => {
    return (
        <section className='bg-[#6a827b]'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <img
                        src={"https://ipsystemsusa.com/wp-content/uploads/2022/03/what-are-volatile-organic-compounds-and-how-to-remove-them.jpg"}
                        width={400}
                        height={300}
                        alt="Picture of the VOC icon"
                    />

                    <div className='py-10 max-w-3xl mx-auto text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-3xl text-white font-semibold md:text-6xl  py-5 "
                        >
                            {`What is VOC?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl text-white"
                        >
                            Volatile Organic Compounds (VOCs) are a broad category of airborne organic compounds, that contain carbon and hydrogen, evaporate and disperse easily at room temperature. VOCs are emitted by a wide range of construction materials, paints, furnishings, and everyday consumer products. You will know when a VOC is around you just by the strong smell of it.
                        </motion.span>

                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-2xl text-white font-semibold md:text-5xl  py-5 "
                        >
                            {`Why are we discussing VOCs?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl text-white"
                        >
                            VOCs are highly harmful since they evaporate at room temperature and they are emitted by a variety of sources that we are unaware of. Depending on the exposure levels, they may cause short-term headaches, and eye, throat, and nose irritation, while long-term exposures may cause serious kidney damage and cancer.
                        </motion.span>

                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-2xl text-white font-semibold md:text-5xl  py-5 "
                        >
                            {`VOCs and TVOCs`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl text-white"
                        >
                            As there are thousands of VOCs and many can exist in a room setting, TVOCs (Total Volatile Organic Compounds) are used to represent different groups of VOCs that can exist in an indoor environment. Total Volatile Organic Compounds (TVOCs) represent a class of VOCs that use to indicate the total pool of contaminants. Or we can say that the total sum of VOCs is known as TVOCs.
                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
