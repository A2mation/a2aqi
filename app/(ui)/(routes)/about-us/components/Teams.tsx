"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const teamMembers = [
    {
        name: "Dr. Aranya Sharma",
        role: "Lead Environmental Scientist",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        socials: { linkedin: "#", twitter: "#", mail: "mailto:aranya@example.com" }
    },
    {
        name: "Alex Chen",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
        socials: { linkedin: "#", twitter: "#", mail: "mailto:alex@example.com" }
    },
    {
        name: "Sarah Jenkins",
        role: "Head of Data Analysis",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        socials: { linkedin: "#", twitter: "#", mail: "mailto:sarah@example.com" }
    }
];

const Teams = () => {
    return (
        <section className="py-24 bg-white ">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Driven by <span className="text-blue-600">Innovation</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Our team of environmental specialist and software engineers work around the clock
                        to ensure every breath you take is informed by accurate, real-time data.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                            className="group relative"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-4/5 rounded-4xl mb-6 overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6 }}
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                                    <div className="flex gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <a href={member.socials.linkedin} className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href={member.socials.twitter} className="p-3 bg-white rounded-full text-blue-400 hover:bg-blue-400 hover:text-white transition-colors">
                                            <Twitter size={20} />
                                        </a>
                                        <a href={member.socials.mail} className="p-3 bg-white rounded-full text-slate-600 hover:bg-slate-600 hover:text-white transition-colors">
                                            <Mail size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center px-4">
                                <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {member.name}
                                </h4>
                                <p className="text-slate-500 font-medium text-sm uppercase tracking-widest mt-1">
                                    {member.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Teams;