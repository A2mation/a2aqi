"use client"

import React from "react"
import { motion } from "framer-motion"

const BlogEditLoader = () => {
    return (
        <div className="max-w-7xl mx-auto my-10 p-8 space-y-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-4xl">
            {/* Header Loading State */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-8">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-lg" />
                    <div className="h-4 w-40 bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Classification Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-100 dark:bg-slate-900 rounded" />
                    <div className="h-12 w-full bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800" />
                </div>

                {/* Media Skeleton */}
                <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-100 dark:bg-slate-900 rounded" />
                    <div className="h-12 w-full bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800" />
                </div>
            </div>

            {/* Headline Skeleton */}
            <div className="space-y-4">
                <div className="h-4 w-20 bg-slate-100 dark:bg-slate-900 rounded" />
                <div className="h-16 w-3/4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl" />
            </div>

            {/* Editor Skeleton */}
            <div className="space-y-4">
                <div className="h-4 w-28 bg-slate-100 dark:bg-slate-900 rounded" />
                <div className="h-64 w-full bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-slate-100 dark:border-slate-900 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Loading Content</p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default BlogEditLoader