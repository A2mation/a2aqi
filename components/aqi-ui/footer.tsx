'use client'

import { useEffect, useState } from "react";
import Link from "next/link"
import { Mail, MapPin, ArrowUpRight, Instagram, Twitter, Linkedin, Youtube, Facebook } from "lucide-react"

import ViewStats from "../ViewStats"

const ROLES = [
    { label: "Administrator", href: "/admin/sign-in" },
    { label: "Moderator", href: "#" },
    { label: "Monitors", href: "/monitor/sign-in" },
    { label: "Writer", href: "/blogs/sign-in" },
];

export function Footer() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <footer className="relative bg-inherit pt-24 pb-12 px-6 md:px-12 lg:px-16 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Brand Section - Span 4 columns */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="inline-block relative">
                            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 opacity-10 blur-lg"></div>
                            <div className="relative rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                                <img
                                    src="/favicon.png"
                                    alt="LOGO"
                                    width={140}
                                    height={70}
                                    className="mb-4 object-contain"
                                />
                                <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
                                    Precision tracking for a healthier world. Providing real-time Air Quality and Weather insights across the globe.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Newsletter</h4>
                            <div className="flex max-w-sm items-center gap-2 rounded-full border border-gray-200 p-1 pl-4 focus-within:border-blue-400 transition-all">
                                <input type="email" placeholder="Your email..." className="w-full bg-transparent text-sm outline-none" />
                                <button className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid - Span 5 columns */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Company</h3>
                            <ul className="space-y-4">
                                {["Company", "About Us", "Contact Us"].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="group flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                            {item}
                                            <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Product</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/products" className="group flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        AQI Monitor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/air-quality-map" className="group flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        AQI Map
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Access</h3>
                            <ul className="space-y-4">
                                {ROLES.map((role) => (
                                    <li key={role.label}>
                                        <Link href={role.href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                            {role.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Section - Span 3 columns */}
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Get in Touch</h3>
                        <div className="space-y-5">
                            <a href="mailto:a2mationsolution@gmail.com" className="flex items-center gap-3 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600">a2mationsolution@gmail.com</span>
                            </a>
                            <div className="flex items-start gap-3 group">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                                    <MapPin className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                </div>
                                <span className="text-sm leading-relaxed text-gray-600">
                                    129/1, Sodla Tank Road, North 24 Parganas, Kolkata- 743133
                                </span>
                            </div>
                        </div>
                        <ViewStats />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 border-t border-gray-100 pt-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {[
                                { Icon: Instagram, label: "Instagram" },
                                { Icon: Twitter, label: "Twitter" },
                                { Icon: Linkedin, label: "LinkedIn" },
                                { Icon: Youtube, label: "YouTube" },
                                { Icon: Facebook, label: "Facebook" }
                            ].map(({ Icon, label }) => (
                                <Link key={label} href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label={label}>
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] font-medium text-gray-400">
                            <Link href="#" className="hover:text-gray-900">Privacy</Link>
                            <Link href="#" className="hover:text-gray-900">Terms</Link>
                            <Link href="#" className="hover:text-gray-900">Shipping</Link>
                            <span className="text-gray-300">© 2026 A2AQI Inc.</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}