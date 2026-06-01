import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck } from "lucide-react";

const Footer = ({
    setIsModalOpen
}: {
    setIsModalOpen: (val: boolean) => void
}) => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-10 bg-linear-to-br from-slate-900 to-blue-900 rounded-[3rem] text-white relative"
        >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-xl">
                        <Truck className="text-blue-300" size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Fast-Track Delivery</h3>
                        <p className="text-blue-200 mt-1 max-w-sm">
                            Dispatched within 3-6 days. Premium wooden packaging available
                            for industrial-grade protection.
                        </p>
                    </div>
                </div>
                <Link
                    href="tel:+918777353002"
                    className="block md:hidden px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
                >
                    Contact Sales
                </Link>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden md:block px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
                >
                    Contact Sales
                </button>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck size={200} />
            </div>
        </motion.section>
    )
}

export default Footer
