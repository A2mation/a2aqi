'use client'

import { motion } from "motion/react"


const Hero = () => {
    return (
        <section className='bg-[#f6c65a]'>
            <main className='mx-auto max-w-6xl'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <img
                        src={"https://cdn.shopify.com/s/files/1/0585/8816/8365/files/shutterstock_188586092.jpg?v=1656358936"}
                        width={600}
                        height={400}
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
                            {`What is Pollen?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                            Pollen is a powdery substance that releases by certain plants and trees, especially flowers that helps them reproduce. As it carried by the wind or insects like bees and butterflies that act as an agent for reproduction in plants. But did you know it also acts as an air pollutant?


                        </motion.span>


                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
