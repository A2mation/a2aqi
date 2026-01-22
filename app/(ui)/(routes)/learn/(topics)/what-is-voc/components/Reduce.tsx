'use client'

import { useEffect, useState } from 'react'

const Reduce = () => {
    const [visibleCards, setVisibleCards] = useState<number[]>([])

    useEffect(() => {
        // Stagger animation on mount
        measures.forEach((_, index) => {
            setTimeout(() => {
                setVisibleCards(prev => [...prev, index])
            }, index * 100)
        })
    }, [])

    const measures = [
        {
            id: 1,
            title: 'Ventilation',
            description: 'Ventilation is extremely important when it comes to reducing indoor air pollutants. Keep your doors and windows open so that these chemicals can reduce via ventilation.',
            icon: 'ventilation'
        },
        {
            id: 2,
            title: 'Climate Control',
            description: 'VOCs evaporate and disperse at room temperature and above. Temperature and humidity should be as low as possible to avoid evaporation and dispersion of VOCs.',
            icon: 'climate'
        },
        {
            id: 3,
            title: 'Dispose of unused chemicals',
            description: 'Clear out or dispose of any unwanted and unused chemicals. Disposal of unused chemicals and bury paints or varnishes whenever you need them.',
            icon: 'dispose'
        },
        {
            id: 4,
            title: 'Check for chemical leakages',
            description: 'Chemical leakage can cause damage to the property and harm to human health as well. If you have stored chemicals, always keep a check for any chemical leakages.',
            icon: 'chemical'
        },
        {
            id: 5,
            title: 'Choose the right time for renovations',
            description: 'When renovating, humans should not expose to emissions. Hence, renovations must be done when no people are present in that indoor setting.',
            icon: 'renovation'
        },
        {
            id: 6,
            title: 'Control Potential VOC emitters',
            description: 'Burning of fuels such as fuel is not allowed indoors. Sources such as fuel burning and indoor smoking should reduce to keep VOC levels in check.',
            icon: 'emitters'
        }
    ]

    const IconComponent = ({ type }: { type: string }) => {
        switch (type) {
            case 'ventilation':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <path d="M 30 30 L 70 30 L 70 70 L 30 70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 35 40 L 65 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 35 50 L 65 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 35 60 L 65 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-spin" style={{ animationDuration: '3s' }} />
                    </svg>
                )
            case 'climate':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <circle cx="40" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 35 45 Q 35 55 45 55" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 50 30 L 50 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 45 35 L 55 35" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 45 50 L 55 50" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 45 65 L 55 65" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" className="animate-bounce" />
                    </svg>
                )
            case 'dispose':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <path d="M 35 35 L 65 35 L 62 70 Q 50 75 38 70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 40 35 L 60 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 42 45 L 42 65" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 50 45 L 50 65" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 58 45 L 58 65" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="45" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" style={{ animationDuration: '2s' }} />
                    </svg>
                )
            case 'chemical':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <circle cx="35" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="65" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 35 40 L 35 60" stroke="currentColor" strokeWidth="2" />
                        <path d="M 65 40 L 65 60" stroke="currentColor" strokeWidth="2" />
                        <path d="M 30 60 L 70 60 Q 70 70 50 72 Q 30 70 30 60" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                    </svg>
                )
            case 'renovation':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <rect x="30" y="35" width="40" height="35" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M 45 45 L 45 60" stroke="currentColor" strokeWidth="2" />
                        <path d="M 55 45 L 55 60" stroke="currentColor" strokeWidth="2" />
                        <path d="M 40 52 L 60 52" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M 35 42 L 65 42" stroke="currentColor" strokeWidth="2" strokeDasharray="2" className="animate-pulse" />
                        <circle cx="65" cy="40" r="3" fill="currentColor" className="animate-bounce" />
                    </svg>
                )
            case 'emitters':
                return (
                    <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="35" fill="#fecaca" opacity="0.3" className="animate-pulse" />
                        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M 50 42 L 50 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" style={{ animationDelay: '0s' }} />
                        <path d="M 58 45 L 65 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <path d="M 58 55 L 65 62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <path d="M 42 45 L 35 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white px-4 py-8 sm:py-12 md:py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12 md:mb-20 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
                        Preventive Measures to Reduce VOC Levels in Your Space
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
                        Indoor air is often up to <span className="text-red-600 font-semibold">5x more polluted</span> than ambient air and as we spend more than <span className="text-red-600 font-semibold">90% of our time indoors</span>, it is important to keep the TVOC levels in check and try to reduce them as much as possible.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {measures.map((measure, index) => (
                        <div
                            key={measure.id}
                            className={`
                                    bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500
                                    p-6 sm:p-8 border border-gray-100 hover:border-blue-200
                                    transform hover:-translate-y-2 cursor-pointer
                                    ${visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                    transition-all duration-700 ease-out
                                `}
                            style={{
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Icon */}
                            <div className="mb-4 text-gray-400 transform group-hover:scale-110 transition-transform duration-300">
                                <IconComponent type={measure.icon} />
                            </div>

                            {/* Number Badge */}
                            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full flex items-center justify-center font-bold text-gray-700 text-sm animate-pulse">
                                {measure.id}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                {measure.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                                {measure.description}
                            </p>

                            {/* Animated Bottom Border */}
                            <div className="mt-4 h-1 bg-gradient-to-r from-orange-300 via-pink-300 to-orange-300 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 sm:mt-20 md:mt-20 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <p className="text-gray-600 text-base sm:text-lg mb-4">
                        Implement these preventive measures to maintain healthy indoor air quality
                    </p>
                    <div className="inline-flex gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Reduce
