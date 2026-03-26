'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

import { PRODUCTS } from '@/data/products';

const IconRenderer = ({ name, size = 16 }: { name: string, size?: number }) => {
    const LucideIcon = (Icons as any)[name];
    return LucideIcon ? <LucideIcon size={size} /> : null;
};

const ProductListingPage = () => {
    return (
        <div className="min-h-screen mt-5 pt-10 bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* HEADER SECTION */}
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
                        High-precision CAAQMS displays and sensors designed for industrial, indoor, and outdoor environmental monitoring.
                    </p>
                </header>

                {/* PRODUCT GRID */}
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
                                        <Icons.ArrowUpRight className="text-blue-600" size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-8 flex flex-col grow">
                                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {product.title}
                                </h2>

                                <p className="text-slate-500 mt-3 line-clamp-2 text-sm leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Mini Specs Recap */}
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {product.specs.slice(0, 3).map((spec, i) => (
                                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-100">
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
                                    <a
                                        href="tel:+918777353002"
                                        className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                        title="Call Sales"
                                    >
                                        <Icons.PhoneCall size={20} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* BOTTOM INFO CARD */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-10 bg-linear-to-br from-slate-900 to-blue-900 rounded-[3rem] text-white relative"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-xl">
                                <Icons.Truck className="text-blue-300" size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Fast-Track Delivery</h3>
                                <p className="text-blue-200 mt-1 max-w-sm">
                                    Dispatched within 3-6 days. Premium wooden packaging available for industrial-grade protection.
                                </p>
                            </div>
                        </div>
                        <a
                            href="tel:+918777353002"
                            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
                        >
                            Contact Sales
                        </a>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Icons.ShieldCheck size={200} />
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default ProductListingPage;