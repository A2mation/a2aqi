"use client"

import { motion } from "framer-motion"

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button"
import { IconSparkles } from "@tabler/icons-react"

export function CTASection() {
    return (
        <section className="py-24 px-6 bg-secondary">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-background rounded-3xl border-4 border-b-8 border-border shadow-2xl overflow-hidden"
                >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                    <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                        >
                            <IconSparkles className="w-8 h-8 text-blue-500" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="font-serif text-4xl md:text-5xl font-bold mb-6"
                        >
                            Best Air Quality Monitor
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
                        >
                            for Smart Cities.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Modal>
                                <ModalTrigger className="rounded-full bg-blue-500 hover:bg-blue-600 text-white flex justify-center group/modal-btn">
                                    <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                                        Book a 15-min Call
                                    </span>
                                    <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                                        📞
                                    </div>
                                </ModalTrigger>
                                <ModalBody >
                                    <ModalContent>
                                        <div>
                                            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                                                Book your {" "}
                                                <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                                                    AQI Display
                                                </span>{" "}
                                                now! ✈️
                                            </h4>
                                        </div>
                                        <div className="flex justify-center items-center px-2 py-10">
                                            <span className="pr-1">
                                                Please call us at {` `}
                                            </span>
                                            <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                                                8777353002
                                            </span>{" "}

                                        </div>
                                        <div className="pt-5 pb-12 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
                                            Or,
                                        </div>

                                        <div className="flex justify-center items-center px-2">
                                            <span className="pr-1">
                                                Email us at {` `}
                                            </span>
                                            <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                                                a2mationsolution@gmail.com
                                            </span>{" "}

                                        </div>
                                    </ModalContent>
                                    <ModalFooter className="gap-4">
                                        We look forward to doing business with you.
                                    </ModalFooter>
                                </ModalBody>
                            </Modal>

                            <Button size="lg" variant="outline" className="rounded-full bg-transparent">
                                <a href="http://www.a2mation.in/">
                                    View Our Work
                                </a>
                            </Button>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-sm text-muted-foreground mt-6"
                        >
                            No commitment required • Free consultation • Response within 24 hours
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
