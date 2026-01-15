'use client'

import { motion } from 'motion/react'
import Image from "next/image"

const Hero = () => {
    return (
        <section className='bg-[#74698c]'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <Image
                        src={"/assets/co-icon.png"}
                        width={200}
                        height={100}
                        alt="Picture of the CO icon"
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
                            {`About Carbon Monoxide (CO) Gas`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl  text-white"
                        >
                            Carbon monoxide (Co) is a flammable gas that is colorless, tasteless, and odorless. Moreover, It is the most frequent and dangerous gas found in both indoor and outdoor settings. Hence, Humans are unable to smell this gas. Carbon monoxide poisoning is caused by prolonged exposure to this gas at high levels. Furthermore, We can only discover and avoid any disasters caused by this toxic gas by co-monitoring. It is created both artificially and naturally. CO, on the other hand, is naturally present in the atmosphere but in extremely small amounts. On the other hand, it is naturally present in the atmosphere but in extremely small amounts.
                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
