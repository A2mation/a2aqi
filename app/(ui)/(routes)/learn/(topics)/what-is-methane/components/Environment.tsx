'use client'

import { motion } from 'motion/react'

const Environment = () => {
    return (
        <main className='bg-slate-50'>
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
                            {`Methane (CH4) in the Environment`}
                        </motion.div>
                        <div className="mt-4 w-3/4 mb-10">

                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-neutral-600 dark:text-neutral-400 "
                            >
                                Methane is a potent greenhouse gas that helps in trapping the heat inside the earths environment resulting in global warming. It uses as a coolant in refrigerators and air conditioners. And in some industrial refrigerant applications, such as food industries. It majorly used as a natural gas.

                            </motion.span>

                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-center gap-4 w-full p-2">
                    <img
                        src={'https://www.columbia.edu/~vjd1/greenhouse.gif'}
                        className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"
                        width={400}
                        height={400}
                    />
                </div>
            </section>
        </main>
    )
}

export default Environment
