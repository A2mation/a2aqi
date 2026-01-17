'use client'

import { motion } from "motion/react"

const Info = () => {
    return (
        <main className='mx-auto max-w-7xl'>
            <div
                className='flex items-center justify-center flex-col px-10 py-20'
            >

                <div className=' text-center'>
                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-2xl font-semibold md:text-5xl text-black py-5 "
                    >
                        {`How is it important?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        Pollen is a powdery material discharged from a male flowers antlers that performs an important role in plant reproduction. And pollination is the process through which, it is conveyed by various agents. This occurs during the summer, spring, and autumn seasons. Hence, the fruits and vegetables we consume were once flowers that were pollinated and grown into fruits or vegetables.
                    </motion.span>

                    <motion.h2
                        id="hero-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="heading-xl text-2xl font-semibold md:text-5xl text-black py-5 "
                    >
                        {`What is pollination?`}
                    </motion.h2>

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className=" text-base lg:text-2xl  text-black"
                    >
                        Pollination is the process of transferring pollen grains from one flower to the other. Or the same flower with the help of insects, wind, or sometimes even water. Two broad categories of plants that reproduce with the help of pollination are:
                    </motion.span>

                </div>
            </div>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center flex-col md:flex-row m-2 p-2">
                    <img
                        src={"https://static1.squarespace.com/static/54a0bf64e4b07c077784c627/t/5613df57e4b0efff54b048ea/1444142936855/?format=1500w"}
                        width={400}
                        height={400}
                        alt="Picture of the pollen"
                    />
                    <div>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-xl font-semibold md:text-3xl text-black py-5 "
                        >
                            {`Angiosperms`}
                        </motion.h2>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black p-2"
                        >
                            Angiosperms are flowering plants with reproductive systems in their flowers (seeds enclosed within the ovary). They have a seasonal life cycle. And these pollinated by insects, wind, and water. With it, they usually have flat leaves and hardwood. For instance, apple, maple, rose, wheat, and dandelion, among others.
                        </motion.span>
                    </div>


                </div>

                <div className="flex items-center flex-col md:flex-row m-2 p-2">
                    <img
                        src={"https://fiveable.me/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstatic.prod.fiveable.me%2Fsearch-images%252F%2522Characteristics_of_gymnosperm_reproduction%252C_seed_development%252C_male_and_female_cones%252C_pollination%252C_and_fertilization%2522-4625107600_216d72f3ae_z.jpg&w=3840&q=75"}
                        width={400}
                        height={400}
                        alt="Picture of the pollen"
                    />
                    <div>
                        <motion.h2
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="heading-xl text-xl font-semibold md:text-3xl text-black py-5 "
                        >
                            {`Gymnosperms`}
                        </motion.h2>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className=" text-base lg:text-2xl  text-black p-2"
                        >
                            Gymnosperms are non-flowering plants with reproductive systems in their cones (uncovered seeds). They are evergreen and pollinated primarily by wind. They have needle-like leaves and softwood. For example cypress, pine, yew, spruce, etc.
                        </motion.span>
                    </div>


                </div>

            </div>
        </main>
    )
}

export default Info
