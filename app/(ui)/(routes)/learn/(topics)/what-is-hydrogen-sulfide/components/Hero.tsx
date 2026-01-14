"use client"

import Image from 'next/image'

import { motion } from 'motion/react'

const Hero = () => {
    return (
        <section className='bg-blue-400'>
            <main className='max-w-7xl mx-auto'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <Image
                        src={"/assets/h2s-gas-icon.png"}
                        width={300}
                        height={300}
                        alt="Picture of the author"
                    />

                    <div className='py-10'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="heading-xl text-2xl md:text-7xl text-white py-5 text-center"
                        >
                            {`Hydrogen Sulfide (H₂S)`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl text-white text-center"
                        >
                            Hydrogen Sulfide, H₂S is a highly toxic gas that has a distinctive and unpleasant rotten-egg smell. It is a colorless gas, that can occur naturally in the air via various crude or natural oil sources, volcanic gases, and spring waters. Trace amounts of H₂S can be found in the atmosphere which is generally not harmful.
                        </motion.span>
                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
