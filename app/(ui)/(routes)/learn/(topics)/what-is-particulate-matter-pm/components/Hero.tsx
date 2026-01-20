'use client'

import { motion } from "motion/react"
import Image from "next/image"

const Hero = () => {
    return (
        <section className='bg-[#9ec9b9]'>
            <main className='mx-auto max-w-6xl'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <Image
                        src={"/assets/pm10-perameter.png"}
                        width={200}
                        height={100}
                        alt="Picture of the pollen"
                    />

                    <div className='py-10 text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-3xl font-semibold md:text-6xl text-black py-5 "
                        >
                            {`What is Particulate Matter (PM)?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                            PM, Particulate matter, or Particulate is a mixture of liquid and solid particles that are suspended in the air. So, they can range from microscopic particles to particles like smoke, soot, liquid particles, and dust. And it can be seen by the naked eye. Hence, these categorized into 3 categories, based on their size. Thus, these are PM10 (coarse, visible to the naked eye), PM2.5 (fine particles), and PM1 (ultra-fine particles).
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                            According to the AQLI (Air Quality Life Index), Particulate air pollution reduces the average persons life by 2.2 years, which is more than deadly infectious illnesses like HIV/AIDS and TB, cigarette smoking, or even war. Some parts of the world more affected than others. For instance, in the U.S.A, where pollution is lower, life expectancy is reduced by only 0.1 years, compared to the WHO standard. In China and India, where pollution levels are significantly higher. Hence, the lowering particle concentrations to the WHO limit would enhance life expectancy by 2.6 and 5.9 years, respectively.
                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
