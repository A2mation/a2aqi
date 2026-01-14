"use client"

import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { motion } from "framer-motion"

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "Air Quality Monitoring:",
            answer:
                "Our Air Quality sensors provide real-time pollution data, helping cities manage air quality and improve public health.",
        },
        {
            question: "Flood Risk Management:",
            answer:
                "High-quality sensors monitor water levels, enabling proactive flood responses and infrastructure planning.",
        },
    ]

    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-4xl md:text-5xl font-bold mb-4 text-blue-500"
                    >
                        Feasible Execution of Smart Solutions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Everything you need to know about optimize hospital .
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="border border-border rounded-xl overflow-hidden bg-secondary"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-background/50 transition-colors"
                            >
                                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                                <IconChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-6 pb-5 text-muted-foreground leading-relaxed"
                                >
                                    {faq.answer}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
