'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Zap, Heart, Brain, Bug as Lung, Droplet } from 'lucide-react'

const Effects = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
        },
        hover: {
            y: -8,
            transition: { duration: 0.2 },
        },
    }

    const shortTermEffects = [
        {
            title: 'Eye, nose, and throat irritation',
            description:
                'VOCs create strong odors. These can irritate your eyes, your nose and throat if you inhale them.',
            icon: AlertCircle,
        },
        {
            title: 'Skin problems',
            description:
                'When VOCs are exposed to sunlight and NOx, causes a photochemical reaction that emits O3 that can cause various skin problems.',
            icon: Zap,
        },
        {
            title: 'Headaches',
            description:
                'Strong smells in the presence of VOCs can cause headaches when exposed to relatively low levels in the short term.',
            icon: Brain,
        },
        {
            title: 'Vomiting',
            description:
                'VOCs can cause nausea and dizziness in the short term, which can lead to loss of coordination and vomiting.',
            icon: AlertCircle,
        },
    ]

    const longTermEffects = [
        {
            title: 'Irritation in the lungs',
            description:
                'Exposure to VOCs at high levels can cause inflammation in the airways, which can cause lung irritation.',
            icon: Lung,
        },
        {
            title: 'Liver and kidney damages',
            description:
                'Inhaling VOCs for longer durations can cause various health issues including damage to the kidney and lungs.',
            icon: Heart,
        },
        {
            title: 'Central Nervous System damages',
            description:
                'Long-term exposures to toxins such as toluene and xylene can cause severe damage to the nervous system.',
            icon: Brain,
        },
        {
            title: 'Cancer',
            description:
                'Many VOCs indoors are probable or considered carcinogens by several authorities. These include benzene and formaldehyde.',
            icon: AlertCircle,
        },
    ]

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4 md:py-16">
            <motion.div
                className="mx-auto max-w-7xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div className="text-center mb-8 md:mb-16" variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: 'easeOut' },
                    },
                }}>
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-pretty">
                        Health Effects of VOCs
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        VOCs propensity to create health impacts ranges significantly, from very hazardous to
                        those with no known health effects. The concentration and duration of chemical exposure
                        affect how VOCs affect human health.
                    </p>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Short-term Effects */}
                    <motion.div variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: 'easeOut' },
                        },
                    }}>
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                            Short-term health effects may include:-
                        </h2>
                        <p className="text-sm md:text-xl text-muted-foreground mb-8 text-center">
                            Short-term health effects of VOCs can last from hours to days. Some of the symptoms
                            may include shortness of breath, allergic skin reactions, dizziness, nausea, and
                            fatigue. Short-term health effects may include:
                        </p>

                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {shortTermEffects.map((effect, index) => {
                                const Icon = effect.icon
                                return (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="bg-card dark:bg-secondary/50 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                </motion.div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg md:text-2xl text-foreground mb-2">{effect.title}</h3>
                                                <p className="text-sm md:text-lg text-muted-foreground">{effect.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>

                    {/* Long-term Effects */}
                    <motion.div variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: 'easeOut' },
                        },
                    }}>
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            >
                                <Droplet className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                            Long-term health effects
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground mb-8 text-center">
                            Long-term exposure to VOCs can be very harmful to your health, with symptoms lasting
                            for years. Because, VOCs such as benzene and C6H6 can have long-term effects on your
                            health. Symptoms may include chronic headaches and loss of coordination. Long-term
                            health impacts may include:
                        </p>

                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {longTermEffects.map((effect, index) => {
                                const Icon = effect.icon
                                return (
                                    <motion.div
                                        key={index}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="bg-card dark:bg-secondary/50 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                                </motion.div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg md:text-2xl text-foreground mb-2">{effect.title}</h3>
                                                <p className="text-sm md:text-lg text-muted-foreground">{effect.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    )
}

export default Effects
