'use client'

import { motion } from "motion/react"

const Solution = () => {
    return (
        <main className='mx-auto max-w-6xl'>
            <div
                className='flex items-center justify-center flex-col px-10 py-20'
            >

                <div className='py-10 text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-3xl font-semibold md:text-6xl text-black py-5 "
                    >
                        {`Solutions for Pollen Allergies`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        If you are allergic to it, consider purchasing an excellent N-95 mask. Because it can prevent the inhalation of pollen particles. When a proper mask is used effectively and per the recommendations. So the risk of pollen allergies is considerably reduced. Hence, an N95 anti anti-pollution mask will not only prevent you from pollen but also other air pollutants. Since, these are harmful to your and your loved ones healths.


                    </motion.span>


                </div>

            </div>
        </main>
    )
}

export default Solution
