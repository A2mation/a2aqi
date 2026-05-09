"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const EmptyParamsErrorState = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-md w-full text-center space-y-8"
            >
                {/* Animated Icon Container */}
                <div className="relative flex justify-center">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full"
                    >
                        <AlertCircle size={64} className="text-red-500" strokeWidth={1.5} />
                    </motion.div>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full -z-10" />
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Missing Parameters
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                        We couldn't identify the blog you're looking for. The URL might be broken or the ID is missing.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        variant="outline"
                        asChild
                        className="rounded-full px-8 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home size={18} /> Home
                        </Link>
                    </Button>

                    <Button
                        asChild
                        className="rounded-full px-8 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-lg"
                    >
                        <button onClick={() => window.history.back()} className="flex items-center gap-2">
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </Button>
                </div>

                {/* Decorative elements */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs font-mono text-slate-400 uppercase tracking-widest pt-8"
                >
                    Error Code: NULL_PARAMS_ID
                </motion.p>
            </motion.div>
        </div>
    )
}

export default EmptyParamsErrorState