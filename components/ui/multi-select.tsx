'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, Hash, PlusIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Category, useCategoryStore } from '@/store/category.store'
import { getCategoryData } from '@/store/category.actions'

interface MultiSelectProps {
    value: Category[]
    onChange: (value: Category[]) => void
    disabled?: boolean
}

export function MultiSelect({ value, onChange, disabled }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const { categories, loading } = useCategoryStore()

    useEffect(() => {
        if (categories.length === 0) getCategoryData()
    }, [categories.length])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const unselectedOptions = categories.filter(
        option => !value.some(v => v.id === option.id)
    )

    const handleSelect = (cat: Category) => {
        onChange([...value, cat])
        if (unselectedOptions.length <= 1) setIsOpen(false)
    }

    return (
        <div className="w-full space-y-3">
            <div ref={containerRef} className="relative">
                {/* Main Trigger Area */}
                <div 
                    onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                    className={`
                        min-h-14 w-full cursor-pointer rounded-2xl border transition-all duration-300
                        flex items-center justify-between px-4 py-2 gap-3
                        ${isOpen 
                            ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-white shadow-sm' 
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        <AnimatePresence>
                            {value.length === 0 && (
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-400 text-sm font-medium"
                                >
                                    Choose categories...
                                </motion.span>
                            )}
                            {value.map(item => (
                                <motion.div
                                    key={item.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                                >
                                    <Hash size={12} className="opacity-50" />
                                    <span className="text-xs font-bold uppercase tracking-tight">{item.title}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onChange(value.filter(v => v.id !== item.id))
                                        }}
                                        className="p-0.5 hover:bg-indigo-200/50 rounded-md transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <motion.div 
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="text-slate-400"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {unselectedOptions.length > 0 ? (
                                    unselectedOptions.map(option => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleSelect(option)
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    <Hash size={16} />
                                                </div>
                                                <span className="font-medium">{option.title}</span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlusIcon />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        <p className="text-sm font-medium">All categories selected</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

