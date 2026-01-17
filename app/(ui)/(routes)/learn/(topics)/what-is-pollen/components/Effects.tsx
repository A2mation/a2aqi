'use client'

import { motion } from "motion/react"

export default function Effects() {
    return (
        <section className='bg-[#f6c65a]'>
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
                            className="heading-xl text-2xl font-semibold md:text-4xl text-black py-5 "
                        >
                            {`Does pollen affect humans?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                            As discussed above, the wind is the common carrier of pollen grains. And it can remain suspended in the air for days. When inhaled, a person can experience sneezing, irritation in the eyes and the respiratory tract, runny nose, etc. Some people are more susceptible to these symptoms than others. This is commonly known as pollen allergy. This can be extremely dangerous for people with respiratory diseases like asthma, as it acts as a trigger for asthma.
                        </motion.span>


                    </div>
                    <img
                        src={"https://www.fasttrackurgentcare.com/wp-content/uploads/2023/06/What-Is-Pollen-And-Where-Does-It-Come-From.jpg"}
                        width={800}
                        height={600}
                        alt="Picture of the pollen"
                    />


                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl italic text-black border border-black rounded-2xl p-6 m-5"
                    >
                        An allergen, such as pollen, can cause an asthma attack in someone who has allergic asthma. The frequency of allergic asthma is around 80% in children with asthma and 60% in adults. - Kenneth Mendez, President, and CEO of the Asthma and Allergy Foundation of America (AAFA).
                    </motion.span>


                    <div className='py-10 text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-2xl font-semibold md:text-4xl text-black py-5 "
                        >
                            {`Health Effects of pollen on humans`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black"
                        >
                           Allergic reactions from pollen can range from mild to severe and from person to person. In some cases, allergies can trigger a life-threatening reaction known as anaphylaxis. As, inhaling it can cause symptoms like:
                        </motion.span>


                    </div>
                    <img
                        src={"https://max-website20-images.s3.ap-south-1.amazonaws.com/Types_of_Allergies_8d3af3219e.jpg"}
                        width={600}
                        height={300}
                        alt="Picture of the pollen"
                    />

                </div>
            </main>
        </section>
    )
}
