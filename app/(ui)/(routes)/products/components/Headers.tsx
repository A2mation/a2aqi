import { motion } from "framer-motion";

const Headers = () => {
    return (
        <header className="mb-5 text-center lg:text-left selection:bg-green-500 selection:text-white">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4"
            >
                Air Quality Solutions
            </motion.div>
            <h1 className="pb-2 text-4xl font-extrabold tracking-tight sm:text-5xl bg-linear-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Product Catalog
            </h1>
            <p className="text-xl text-slate-500 mt-4 max-w-2xl">
                High-precision CAAQMS displays and sensors designed for industrial,
                indoor, and outdoor environmental monitoring.
            </p>
        </header>
    )
}

export default Headers
