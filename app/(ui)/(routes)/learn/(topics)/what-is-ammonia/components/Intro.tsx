"use client"
import { motion } from 'motion/react'

const Intro = () => {
  return (
    <section
      className=" h-full max-w-7xl mx-auto my-25"
    >
      <div
        className="flex flex-col justify-center items-center w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex gap-2 text-4xl md:text-5xl font-bold mb-5 px-2 flex-wrap justify-center"
        >
          <span className="text-green-800">
            Ammonia
          </span>
          in the human body
        </motion.div>
        <div className="mt-4 w-3/4 mb-10">

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 "
          >
            Ammonia can found in the blood culture of humans. Normal ammonia blood levels range between 15 to 45 micrograms/dL. There are medical reasons as well as external factors that can increase blood ammonia toxicity in the body. Hence it can result in various health problems, that depend on the nature of ammonia exposure. These include inhalation, ingestion, or direct contact with the eyes or the skin, which can cause a severe burn.

          </motion.span>

        </div>
        <div className="flex items-center justify-center f gap-4 h-full w-full p-2">
          <img
            src={"/assets/ammonia-nh3-in-human-body.png"}
            className="h-1/2 w-1/2 my-10 border-b-cyan-900 rounded-2xl"

          />
        </div>
      </div>


    </section >
  )
}

export default Intro
