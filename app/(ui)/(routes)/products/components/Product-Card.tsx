import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight, PhoneCall } from "lucide-react";

import { PRODUCTS } from "@/data/products";


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
    // State to store chosen filter. null means no selection initially (shows all)
    const [selectedBadge, setSelectedBadge] = useState < string | null > (null);

    // Get unique badges dynamically : ['Standard', 'Hand-held', 'Industrial Grade']
    const uniqueBadges = Array.from(new Set(PRODUCTS.map((p) => p.badge)));

    const filteredProducts = selectedBadge
        ? PRODUCTS.filter((product) => product.badge === selectedBadge)
        : PRODUCTS;

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-wrap justify-center items-center gap-3">
                <button
                    onClick={() => setSelectedBadge(null)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${selectedBadge === null
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900 bg-slate-100"
                        }`}
                >
                    {selectedBadge === null && (
                        <motion.div
                            layoutId="activeFilterBg"
                            className="absolute inset-0 bg-green-700 rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">All Products</span>
                </button>

                {uniqueBadges.map((badge) => {
                    const isSelected = selectedBadge === badge;
                    return (
                        <button
                            key={badge}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${isSelected
                                ? "text-white"
                                : "text-slate-600 hover:text-slate-900 bg-slate-100"
                                }`}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="activeFilterBg"
                                    className="absolute inset-0 bg-green-700 rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{badge}</span>
                        </button>
                    );
                })}
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            layout
                            key={product.slug}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                                mass: 1
                            }}
                            className="group bg-white rounded-[2.5rem] border border-green-200 shadow-sm hover:shadow-2xl hover:shadow-green-100 transition-shadow duration-500 flex flex-col"
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
                                        <ArrowUpRight className="text-green-600" size={20} />
                                    </div>
                                </div>
                                {/* Badge Overlay Indicator */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                                        {product.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-8 flex flex-col grow">
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors"
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
                                        className="flex-1 text-center bg-green-700 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                                    >
                                        View Details
                                    </Link>

                                    {/* CALL BUTTON: Direct Dialing */}
                                    <Link
                                        href="tel:+918777353002"
                                        className="md:hidden p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                        title="Call Sales"
                                    >
                                        <PhoneCall size={20} />
                                    </Link>

                                    <button
                                        className="hidden p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95 md:flex items-center justify-center"
                                        title="Call Sales"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <PhoneCall size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ProductCard;