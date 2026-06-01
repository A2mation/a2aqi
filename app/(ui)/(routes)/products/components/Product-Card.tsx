import Link from "next/link";
import { motion } from "framer-motion";

import { PRODUCTS } from "@/data/products";
import { ArrowUpRight, PhoneCall } from "lucide-react";
import * as Icons from "lucide-react";
import React from "react";

const IconRenderer = ({ name, size = 16 }: { name: string; size?: number }) => {
    const LucideIcon = (Icons as any)[name] as React.ComponentType<{
        size?: number;
        className?: string;
    }> | undefined;
    return LucideIcon ? <LucideIcon size={size} /> : null;
};

const ProductCard = ({
    setIsModalOpen
}: {
    setIsModalOpen: (val: boolean) => void
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product, index) => (
                <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col"
                >
                    {/* Image Container */}
                    <div className="relative aspect-4/3 overflow-hidden rounded-t-[2.5rem] bg-slate-100">
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4">
                            <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm">
                                <ArrowUpRight className="text-blue-600" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-8 flex flex-col grow">
                        <Link
                            href={`/products/${product.slug}`}
                            className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                        >
                            {product.title}
                        </Link>

                        <p className="text-slate-500 mt-3 line-clamp-2 text-sm leading-relaxed">
                            {product.description}
                        </p>

                        {/* Mini Specs Recap */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {product.specs.slice(0, 3).map((spec, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-100"
                                >
                                    <IconRenderer name={spec.icon} size={12} />
                                    {spec.value}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                            <Link
                                href={`/products/${product.slug}`}
                                className="flex-1 text-center bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                View Details
                            </Link>

                            {/* CALL BUTTON: Direct Dialing */}
                            <Link
                                href="tel:+918777353002"
                                className="md:hidden p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                title="Call Sales"
                            >
                                <PhoneCall size={20} />
                            </Link>

                            <button
                                className="hidden p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 md:flex items-center justify-center"
                                title="Call Sales"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <PhoneCall size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default ProductCard
