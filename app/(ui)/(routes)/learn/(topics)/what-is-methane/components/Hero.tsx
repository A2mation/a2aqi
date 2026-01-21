'use client'

import { motion } from 'motion/react'
import Image from "next/image"

const Hero = () => {
    return (
        <section className='bg-[#556fb7]'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <Image
                        src={"/assets/ch4-icon.png"}
                        width={300}
                        height={200}
                        alt="Picture of the SO2 icon"
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
                            {`Methane (CH4)`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-xl text-white"
                        >
                            Methane (CH4) is a colorless and odorless gas that makes it impossible to detect by the human senses. It is a flammable gas that is used as fuel for vehicles, water heaters, etc.
                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
