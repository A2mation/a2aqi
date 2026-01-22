'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'

const vocData = [
    {
        number: 1,
        title: 'Plywood and Furniture',
        description:
            'The primary VOC found in plywood and particle boards is formaldehyde or HCHO. Since new furniture contains a high amount of VOCs and as time passes, they slowly escape from the wooden furniture. This is known as off-gassing.',
    },
    {
        number: 2,
        title: 'Vinyl Flooring',
        description:
            'A vinyl floor will emit some amount of VOCs for a short period after the installation due to the materials used in vinyl production. They can contaminate the air quality where they installed and can cause various respiratory issues over time.',
    },
    {
        number: 3,
        title: 'Carpets and Upholstery',
        description:
            'Various chemicals are used in the manufacturing of carpets and upholstery. VOCs in them can therefore be highly concerning. Due to this, they could pose several health issues.',
    },
    {
        number: 4,
        title: 'Smoking and tobacco products',
        description:
            'VOCs in large amounts produced when tobacco products are burnt and incomplete combustion of tobacco takes place. So, these VOCs are responsible for various respiratory and heart diseases.',
    },
    {
        number: 5,
        title: 'Photocopying and Printing',
        description:
            'To print a document, the toner that used for printing is heated. They emit small amounts of VOCs that are produced by this process. Even harmful ozone can produce by laser printers.',
    },
    {
        number: 6,
        title: 'Perfumes',
        description:
            'Have you ever had a sharp pain in your head when someone wearing strong perfume walks by? This is due to the high amount of VOCs that are present in perfumes which can cause dizziness and headaches.',
    },
    {
        number: 7,
        title: 'Cleaning products and Air Fresheners',
        description:
            'Exposure to VOCs present in many household cleaning products and air fresheners is known to cause serious harm to human health. These commonly include asthma, eczema, endocrine disruption, etc.',
    },
    {
        number: 8,
        title: 'Paints',
        description:
            'Ever wondered why a freshly painted wall smell has a strong smell and as time passes it wears off? This is because of the VOCs that are present in paints. They slowly wear off as time passes due to off-gassing.',
    },
    {
        number: 9,
        title: 'Markers, glue, and whiteners',
        description:
            'Hobby supplies are made to dry quickly at room temperature. That is why hobby items such as markers, glue, and whiteners made with materials containing VOCs that evaporate at room temperature, making these products equally harmful.',
    },
    {
        number: 10,
        title: 'Candle and incense burning',
        description:
            'Scented candles or incense sticks are made in such a way that they create a pleasant aroma in their immediate surroundings. However, they produce with VOC-containing components that, when burned, evaporate and disperse around the room, which can be annoying to certain people.',
    },
]

interface VOCItemProps {
    number: number
    title: string
    description: string
    delay?: number
}

const Source = () => {
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


    return (
        <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4 md:px-6 lg:px-8">
            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Title */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    variants={{
                        hidden: { opacity: 0, y: -30 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.7,
                                ease: 'easeOut',
                            },
                        },
                    }}
                >
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        Primary Sources of{' '}
                        <span className="bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                            VOCs
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                        Understanding Volatile Organic Compounds in our surroundings
                    </p>
                </motion.div>

                {/* VOC Items */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                    variants={containerVariants}
                >
                    {vocData.map((item, index) => (
                        <VOCItem
                            key={item.number}
                            {...item}
                            delay={index * 0.08}
                        />
                    ))}
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="mt-16 md:mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">
                        VOCs can significantly impact indoor air quality and human health. Stay informed and take preventive measures.
                    </p>
                </motion.div>
            </motion.div>
        </main>
    )
}

export default Source


function VOCItem({
    number,
    title,
    description,
    delay = 0,
}: VOCItemProps) {

    return (
        <motion.div
            className="p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        delay,
                        ease: 'easeOut',
                    },
                },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            whileHover="hover"
        >
            <motion.div
                className="flex items-baseline gap-3 mb-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: delay + 0.1 }}
            >
                <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                    {number}.
                </span>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </motion.div>
            <motion.p
                className="text-sm md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-justify"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
            >
                {description}
            </motion.p>
        </motion.div>
    )
}

