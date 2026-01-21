'use client'

import { motion } from 'motion/react'

const Info = () => {
    return (
        <section
            className=" max-w-6xl mx-auto "
        >
            <div className='mt-10 p-10'>

                <div
                    className="flex flex-col justify-center items-center w-full text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex gap-2 text-4xl md:text-5xl  font-bold mb-5 px-2 text-[#556fb7] flex-wrap justify-center"
                    >
                        {`Climate Change`}
                    </motion.div>
                    <div className="mt-4 w-3/4 mb-10">

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-neutral-600 dark:text-neutral-400 "
                        >
                            Methane is the main component of natural gas. Therefore a major contributor to vehicle emissions that run on CNG. Furthermore, Methane is a greenhouse gas. Hence, CH4 vehicle emissions add to the methane gas levels in the air. This further results in climate change and global warming.
                            <br />

                            It has a higher warming potential than carbon dioxide. As making it essential for any strategies that seek to reduce global warming. Hence, Reductions in methane emissions can result in immediate health benefits. As well as being an important component of energy systems that are less reliant on fossil fuels. Governments should put measures in place to facilitate the reduction of methane emissions from all sources. Such as through improved agricultural practices and livestock management techniques.
                        </motion.span>

                    </div>
                </div>

            </div>

            <div className="flex items-center justify-center gap-4 w-full p-2">
                <img
                    src={'https://www.shutterstock.com/image-vector/vector-illustration-car-exhaust-pollution-600nw-2505696797.jpg'}
                    className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"
                    width={400}
                    height={400}
                />
            </div>






        </section>
    )
}

export default Info
