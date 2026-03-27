"use client"

import { useRouter } from 'next/navigation';
import { ShieldCheck, Cpu, Map, Activity, ExternalLink, Download } from 'lucide-react'

import { Button } from "@/components/ui/button"

const CompanyPage = () => {
    const router = useRouter()
    const driveDownloadUrl = "https://drive.google.com/file/d/1GJpWV2uJi-M3riv8z3PYEZ1_uzZw5ltW/view?usp=sharing";
    return (
        <div className="bg-slate-50 min-h-screen font-sans">

            <section className="relative bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[20px_20px]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Our Mission
                            </span>
                            <div className="h-px w-12 bg-slate-700"></div>
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                                A2MATION
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            A2aqi: The Future of <span className="text-blue-500">Pure Air</span>
                        </h1>
                        <p className="text-lg leading-8 text-slate-300 mb-10">
                            Leveraging industrial automation and cutting-edge software to monitor,
                            analyze, and improve the air quality of India's growing urban landscapes.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                                Explore Real-time Data
                            </Button>
                            <a
                                href={driveDownloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    className="text-slate-900 border-blue-600 hover:bg-blue-600 hover:text-white h-12 px-8 flex items-center gap-2 transition-all shadow-sm"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Brochure</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-y border-slate-200">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
                                Engineered by A2MATION
                            </h2>
                            <div className="space-y-4 text-slate-600 text-lg">
                                <p>
                                    <strong>A2aqi</strong> is a specialized environmental monitoring brand under
                                    <strong> A2MATION TECHNOLOGY SOLUTION (OPC) PVT LTD</strong>.
                                </p>
                                <p>
                                    By combining the parent company's expertise in hardware automation with
                                    modern cloud architecture, we provide cities and organizations with
                                    unprecedented clarity on their environmental impact.
                                </p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">IoT</p>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Ready Hardware</p>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">SaaS</p>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Analytics</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { icon: <Cpu />, title: "Sensor Integrity", desc: "Military-grade PM2.5/PM10 data validation." },
                                { icon: <Map />, title: "GIS Visuals", desc: "Interactive mapping using OpenStreetMap & Leaflet." },
                                { icon: <Activity />, title: "Live Streams", desc: "Real-time pollutant tracking via WebSocket." },
                                { icon: <ShieldCheck />, title: "Compliance", desc: "Automated GST & audit logs for enterprises." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="text-blue-600 mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Global Operations & Contact */}
            <section className="py-20 bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 md:p-16 relative text-white">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="max-w-md text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-4">Ready to implement A2aqi?</h2>
                                <p className="text-blue-100 text-lg">
                                    Connect with our Sales Manager,
                                    to discuss enterprise sensor deployments.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <Button
                                    className="bg-white text-blue-600 hover:bg-slate-100 h-14 px-10 font-bold text-lg"
                                    onClick={() => router.push('/contact-us')}
                                >
                                    Contact Sales Manager
                                </Button>
                                <Button variant="link" className="text-white hover:text-blue-100">
                                    <a href="https://www.google.com/maps/search/?api=1&query=A2MATION+TECHNOLOGY+SOLUTION+Kolkata&query_place_id=ChIJQ1DfFA6R-DkRfbnEwQZ1kns" target="_blank" className="flex items-center">
                                        View HQ Address <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-slate-400 text-sm">
                        <p>© 2026 A2MATION TECHNOLOGY SOLUTION (OPC) PVT LTD. All Rights Reserved.</p>
                        <p>129/1, Sodla Tank Road, North 24 Parganas, West Bengal, Kolkata- 743133</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CompanyPage