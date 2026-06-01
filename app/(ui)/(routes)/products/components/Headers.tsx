import { motion } from "framer-motion";

const Headers = () => {
    return (
        <header className="mb-16 text-center lg:text-left">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4"
            >
                Industrial Air Quality Solutions
            </motion.div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
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
