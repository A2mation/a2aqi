"use client"

import { motion } from "motion/react"

const Enviourment = () => {
  return (
    <section className="min-h-screen py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
          <span className="text-slate-800">Ammonia (NH₃)</span>
          <span className="text-cyan-600 font-semibold"> in Enviornment</span>
        </h1>
      </div>

      <div
        className="flex flex-col md:flex-row justify-center items-center w-full max-w-7xl mx-auto"
      >
        <div className="mt-4 w-3/4 mb-10">

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 "
          >
            Atmospheric sulfates and nitrates mix with ammonia which further forms into second-hand particle pollution (PM2.5).

          </motion.span>

        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center f gap-4 h-full p-2"
        >
          <img
            src={"/assets/ammonia-nh3-in-human-body.png"}
            className="h-1/2 w-1/2 my-10 border-b-cyan-900 rounded-2xl"

          />
        </motion.div>
      </div>

      <div
        className="flex flex-col md:flex-row justify-center items-center w-full max-w-7xl mx-auto"
      >
        <div className="mt-4 w-3/4 mb-10">

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 "
          >
            Ammonia assists in the acidification, salinization, and oxidation of ammonium salts in waterways that affect the marine life.
          </motion.span>

        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center f gap-4 h-full p-2"
        >
          <img
            src={"/assets/ammonia-nh3-in-human-body.png"}
            className="h-1/2 w-1/2 my-10 border-b-cyan-900 rounded-2xl"

          />
        </motion.div>
      </div>
    </section>
  )
}

export default Enviourment
