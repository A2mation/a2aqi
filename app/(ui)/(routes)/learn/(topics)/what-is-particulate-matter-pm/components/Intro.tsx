'use client'

import { motion } from "motion/react"
import Image from "next/image"

const Intro = () => {
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
                        {`Are Particulates and Air Pollution the same thing?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        PM or particulates are fine breathable particles suspended in the air. And, PM is one of the air pollutants that are included in air pollution. As, many other air pollutants together form the broad category of air pollution. These pollutants include Carbon monoxide, Sulphur Dioxide, Nitrogen oxides, Carbon Dioxide, etc. Hence, PM is nothing but a measure to measure air pollution along with other air pollutants.
                    </motion.span>
                </div>
                <img
                    src={"https://smartairfilters.com/wordpress/wp-content/uploads/2019/04/Particle-Sizes-Virus-Labelled.jpg"}
                    width={800}
                    height={400}
                    alt="Picture of the pollen"
                    className="m-5 p-2"
                />
                <div className='text-center'>



                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-2xl font-semibold md:text-5xl text-black py-5 "
                    >
                        {`Types of Particulate Matter (PM)`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        For air quality regulation, particles divided into three categories based on their diameter. These are:
                    </motion.span>

                </div>
            </div>

            <div className="flex items-center max-w-5xl mx-auto justify-between gap-2 flex-col md:flex-row">
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={"/assets/pm1-parameter.png"}
                        width={200}
                        height={200}
                        alt="Picture of the pollen"
                    />
                    <div className="text-center">
                        These are ultra-fine particles with a size of 1 micron or less. Examples: Airborne pathogens, bacteria, viruses, etc.
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={"/assets/pm2.5-parameter.png"}
                        width={200}
                        height={200}
                        alt="Picture of the pollen"
                    />
                    <div className="text-center">
                        These are fine breathable particles with a size of 2.5 microns or less. Examples: Smoke, tobacco smoke, haze, etc
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src={"/assets/pm10-perameter.png"}
                        width={200}
                        height={200}
                        alt="Picture of the pollen"
                    />
                    <div className="text-center">
                        The inhalable particles with a size of 10 microns or less come under this category. Examples: Windblown dust, mold spores, pollen, etc.
                    </div>
                </div>
            </div>

        </main>
    )
}

export default Intro
