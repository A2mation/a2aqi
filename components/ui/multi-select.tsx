'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

export interface Option {
    label: string
    color: string
}

const ALL_OPTIONS: Option[] = [
    { label: 'Ocean', color: 'bg-cyan-100 text-cyan-800' },
    { label: 'Blue', color: 'bg-blue-100 text-blue-800' },
    { label: 'Orange', color: 'bg-orange-100 text-orange-800' },
    { label: 'Red', color: 'bg-red-100 text-red-800' },
    { label: 'Purple', color: 'bg-purple-100 text-purple-800' },
    { label: 'Yellow', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Green', color: 'bg-green-100 text-green-800' },
    { label: 'Forest', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Slate', color: 'bg-slate-100 text-slate-800' },
    { label: 'Silver', color: 'bg-gray-100 text-gray-800' },
]

interface MultiSelectProps {
    value: Option[]
    onChange: (value: Option[]) => void
}

export function MultiSelect({ value, onChange }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const unselectedOptions = ALL_OPTIONS.filter(
        option => !value.find(v => v.label === option.label)
    )

    const handleRemove = (label: string) => {
        onChange(value.filter(item => item.label !== label))
    }

    const handleSelect = (option: Option) => {
        onChange([...value, option])
        setIsOpen(false)
    }

    const handleClearAll = () => {
        onChange([])
    }

    return (
        <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Multi Select
            </h2>

            <div ref={containerRef} className="relative">
                <div className="relative border-2 border-blue-500 rounded-lg bg-white">
                    <div className="flex flex-wrap items-center gap-2 p-3">
                        {value.map(item => (
                            <div
                                key={item.label}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${item.color}`}
                            >
                                <span>{item.label}</span>
                                <button
                                    onClick={() => handleRemove(item.label)}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}

                        {value.length > 0 && (
                            <input
                                type="text"
                                className="flex-1 outline-none bg-transparent text-sm min-w-20"
                                onFocus={() => setIsOpen(true)}
                            />
                        )}
                    </div>

                    <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-2">
                        {value.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Clear all"
                            >
                                <X size={18} className="text-gray-600" />
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                            <ChevronDown size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {isOpen && unselectedOptions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {unselectedOptions.map(option => (
                            <button
                                key={option.label}
                                onClick={() => handleSelect(option)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-sm"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
