'use client'

import { motion } from 'motion/react'

const Hero = () => {
    return (
        <section className='bg-[#169cbe]'>
            <main className='mx-auto max-w-6xl'>
                <div
                    className='flex items-center justify-center flex-col px-10 py-20'
                >
                    <img
                        src={"https://cdn-icons-png.flaticon.com/512/4148/4148388.png"}
                        width={200}
                        height={200}
                        alt="Picture of the author"
                    />

                    <div className='py-10 text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-3xl font-semibold md:text-6xl text-white py-5 "
                        >
                            {`What Is Humidity?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-white"
                        >
                            Humidity is the term for the gaseous water content in the air. The quantity of gaseous water (water vapor) in the atmosphere is known as HUMIDITY, which can change when water is present in excess amounts. For example, when it is about to rain, there is a lot of water vapor in the air.
                        </motion.span>

                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="heading-xl text-xl md:text-4xl font-semibold text-white py-5"
                        >
                            {`Where does Humidity come from?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className=" text-base lg:text-2xl text-white "
                        >
                            There are many factors that decide the humidity of a place, both indoors and outdoors. Temperature plays an important role in deciding the relative humid levels indoors as well as outdoors. For example, when the temperature is hot, the humid level decreases as the air can hold more water content. But when the temperature decreases, the air cannot hold much moisture. Hence, the relative humid level increases. Therefore, when the temperature indoors is cold or hot enough, we need to warm or cool it up, respectfully, to maintain the ideal humidity levels. When there is 100% humidity in the air, it will rain as the air wont be able to hold more water vapour.
                        </motion.span>




                    </div>
                    <img
                        src={"https://www.drmayankshukla.com/wp-content/uploads/2019/02/shukla-iStock-1078226664.jpg"}
                        width={700}
                        height={500}
                        alt="Picture of the author"
                    />

                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="heading-xl text-xl md:text-4xl font-semibold text-white py-5 my-10"
                    >
                        {`What is the difference between Relative & Absolute Humidity?`}
                    </motion.h2>

                    <div className='flex items-center justify-center flex-col md:flex-row'>
                        <div
                            className='flex items-center justify-center flex-col text-center'
                        >
                            <motion.h2
                                id="hero-heading"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="heading-xl text-xl md:text-4xl font-semibold text-white py-5"
                            >
                                {`Relative Humidity`}
                            </motion.h2>

                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className=" text-base lg:text-2xl text-white "
                            >
                                The ratio of the amount of water vapour in the atmosphere to the highest amount of vapour that the air can hold is known as relative humidity.
                            </motion.span>
                        </div>
                        <div
                            className='flex items-center justify-center flex-col text-center my-10'
                        >
                            <motion.h2
                                id="hero-heading"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="heading-xl text-xl md:text-4xl font-semibold text-white py-5"
                            >
                                {`Absolute Humidity`}
                            </motion.h2>

                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className=" text-base lg:text-2xl text-white "
                            >
                                Whereas the quantity of water vapour present in a particular amount of air at a given time and temperature is known as absolute humidity.
                            </motion.span>
                        </div>
                    </div>

                    <img
                        src={"https://www.eurokidsindia.com/blog/wp-content/uploads/2023/10/what-is-measurement-870x570.jpg"}
                        width={600}
                        height={400}
                        alt="Picture of the author"
                    />

                    <div className='text-center my-10'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="heading-xl text-xl md:text-4xl font-semibold text-white py-5"
                        >
                            {`Are humidity and moisture the same?`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className=" text-base lg:text-2xl text-white "
                        >
                            Humidity is the amount of water vapour in the air in its gaseous state. Whereas moisture is the content of water in its liquid state. When air reaches its limit to absorb water in the form of water vapour, water will begin to condense as drops in the air that is why clouds form. That is known as moisture. When humidity reaches its peak, rainfall happens, that is moisture.
                        </motion.span>
                    </div>

                </div>
            </main>
        </section>
    )
}

export default Hero
