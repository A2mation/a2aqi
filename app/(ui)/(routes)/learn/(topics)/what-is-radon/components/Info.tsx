'use client'

import { motion } from 'motion/react'

const Info = () => {
    return (
        <>
            <section
                className=" max-w-6xl mx-auto "
            >
                <div className='my-25 p-10'>

                    <div
                        className="flex flex-col justify-center items-center w-full text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex gap-2 text-4xl md:text-5xl  font-bold mb-5 px-2 text-[#028b7b] flex-wrap justify-center"
                        >
                            {`Where does Radon (Rn) come from?`}
                        </motion.div>
                        <div className="mt-4 w-3/4 mb-10">

                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-neutral-600 dark:text-neutral-400 "
                            >
                                Radon is emitted from soil grains and rocks. It moves as a gas through the soil at varying rates and distances depending on soil texture and other natural and climatic factors. This can seep through cracks and openings in the floor into an enclosed space where radon can accumulate.

                            </motion.span>

                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full p-2">
                        <img
                            src={'https://www.ecohome.net/media/uploads/2018/01/31/thumbs/3X_D2f6zVUqW_1200x0_XJLHedU5.jpg'}
                            className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"

                        />
                    </div>


                    <div className='mt-20 flex items-center py-5 gap-4 flex-col text-center'>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="heading-xl text-4xl md:text-5xl font-semibold text-[#028b7b] py-5 "
                        >
                            {`Sources of radon (Rn) at homes`}
                        </motion.h2>

                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-lg lg:text-2xl text-neutral-600 px-4"
                        >
                            Radon penetrates structures through floor splits or floor-wall joints, gaps around pipes or cables, tiny pores in block walls, cavities in the walls, or drainage systems or sewers. It doesnt matter if your house has a basement or not, the surface closest to the ground will have higher radon levels. Hence, Radon levels are typically higher in basements, cellars, and ground-level residential spaces. As more and more buildings and houses are becoming air-tight, it is impossible for radon gas to pass through the windows via ventilation and as a result, radon levels can be extremely high indoors.
                        </motion.span>

                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 w-full p-2">
                    <img
                        src={'https://t3.ftcdn.net/jpg/04/98/56/62/360_F_498566298_UI7Rso8ZVfy4AdaZ2EYkd76xI5iSldJf.jpg'}
                        className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"

                    />
                </div>


                <div className='mt-20 flex items-center py-5 gap-4 flex-col text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="heading-xl text-4xl md:text-5xl font-semibold text-[#028b7b] py-5 "
                    >
                        {`What makes radon (Rn) more dangerous?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-lg lg:text-2xl text-neutral-600 px-4"
                    >
                        Radon gas is radioactive and has no odor, taste, or smell which makes it difficult for the human body to sense it. It is a carcinogen proven to cause lung cancer in humans. As, Studies have shown an increase in lung cancer rates as a result of increased radon exposure. It classifies by health authorities as a category-one cancer-causing agent. It is the leading cause of lung cancer among non-smokers and the leading cause of cancer after smoking. Each year, around 21,000 people in the United States die from radon-induced lung cancer.
                    </motion.span>

                </div>

                <div className="flex items-center justify-center gap-4 w-full p-2">
                    <img
                        src={'https://images.prismic.io/healthhq/6eadf12a-0733-42a7-99c0-ad7ca17a951c_RadonFacts_HHQ.png?auto=compress,format'}
                        className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"

                    />
                </div>


                <div className='mt-20 flex items-center py-5 gap-4 flex-col text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="heading-xl text-4xl md:text-5xl font-semibold text-[#028b7b] py-5 "
                    >
                        {`Who is more affected by radon exposure?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-lg lg:text-2xl text-neutral-600 px-4"
                    >
                        Radon takes 5-10 years to develop. Children are the most affected by radon exposure, whether exposed in homes or schools. As they are still growing and their lungs and other organs are still at the developing stage. They have more life to live, and hence, the after-effects of radon exposure are very much visible in children, sooner or later.


                    </motion.span>

                </div>


                <div className="flex items-center justify-center gap-4 w-full p-2">
                    <img
                        src={'https://hsseworld.com/wp-content/uploads/2019/05/Rdon-Gas.jpg'}
                        className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"

                    />
                </div>


                <div className='mt-20 flex items-center py-5 gap-4 flex-col text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="heading-xl text-4xl md:text-5xl font-semibold text-[#028b7b] py-5 "
                    >
                        {`Health Impacts By Radon`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-lg lg:text-2xl text-neutral-600 px-4"
                    >
                        It acts after 5-20 years of exposure. When exposed to radon, it wont seriously affect your health in the short term. But you will surely feel and see its serious effects on your health after 5-20 years. Alpha particles do not travel very far, but they travel at half the speed of light and with enough energy to dent bulletproof plastic. Imagine what it can do to your body. Radons radioactive particles can cause harm even decades after initial exposure. Each decade, 10 to 40 thousand people die from radon-induced lung cancer.
                    </motion.span>

                </div>


                <div className="flex items-center justify-center gap-4 w-full p-2">
                    <img
                        src={'https://www.ukradon.org/cms/assets/gfx/content/misc_image_2660cs1b9812b99f.jpg'}
                        className="h-fit w-full bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"

                    />
                </div>


                <div className='mt-20 flex items-center py-5 gap-4 flex-col text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="heading-xl text-4xl md:text-5xl font-semibold text-[#028b7b] py-5 "
                    >
                        {`Why is it important to monitor Radon?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-lg lg:text-2xl text-neutral-600 px-4"
                    >
                        As we discussed, radon is an invisible, odorless, and tasteless gas, there is no possible way to know if it is present inside your premises or not using the human senses. Radon concentrations in a home should ideally be less than 100 Bq/m3. And as radon levels change depending on various factors such as temperature, ventilation, humidity, wind speed and direction, rainfall, snow, air pressure, the foundation of your building, building insulation, etc. there is the need to monitor it continuously, so that proper actions can be taken accordingly that will ensure that levels remain as low as possible.
                    </motion.span>

                </div>





            </section>
        </>
    )
}

export default Info
