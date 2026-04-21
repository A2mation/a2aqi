"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { Check, Home, PhoneCall } from "lucide-react";


import { PRODUCTS } from "@/data/products";
import TechnicalSpecs from "../components/TechnicalSpecs";
import MobileBestQuoteModal from "@/components/modals/mobile-best-qoute-modal";

const SingleProductPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const param = use(params);
  const [activeImg, setActiveImg] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = PRODUCTS.find((p) => p.slug === param.slug) || PRODUCTS[0];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % product.images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [product.images.length, isPaused]);

  return (
    <div className="min-h-screen pt-20 bg-[#f8fafc] text-slate-900 selection:bg-blue-100">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
          <Home size={14} />
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: GALLERY SECTION */}
          <div
            className="lg:col-span-7 space-y-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[2.5rem] bg-white shadow-2xl shadow-blue-100 border border-blue-50"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  src={product.images[activeImg]}
                  className="w-full h-full object-cover rounded-[2.5rem]"
                  alt={product.title}
                />
              </AnimatePresence>

              <div className="absolute bottom-6 right-6 flex gap-1.5">
                {product.images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeImg === i ? "w-8 bg-blue-600" : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  Industrial Grade
                </span>
              </div>
            </motion.div>

            <div className="flex gap-4 pb-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`relative shrink-0 w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImg === idx
                      ? "border-blue-600 ring-4 ring-blue-50 scale-95"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT SECTION */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* HIGHLIGHT FEATURES */}
            <div className="grid grid-cols-1 gap-3">
              {product.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check
                      className="text-white"
                      size={14}
                      strokeWidth={4}
                    />
                  </div>
                  <span className="font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-4">
              <Link
                href="tel:+918777353002"
                className="md:hidden w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
              >
                <PhoneCall size={20} />
                Call for best Quote
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden w-full md:flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
              >
                <PhoneCall size={20} />
                Call for best Quote
              </button>
            </div>

            {/* LOGISTICS BRIEF */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Delivery
                </span>
                <span className="text-slate-900 font-black">
                  {product.logistics.delivery}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Packaging
                </span>
                <span className="text-slate-900 font-black text-right max-w-50 leading-tight">
                  {product.logistics.packaging}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: TECHNICAL SPECS TABLE */}
        <div className="mt-20">
          <TechnicalSpecs product={product} />
        </div>
      </main>
      <MobileBestQuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default SingleProductPage;
