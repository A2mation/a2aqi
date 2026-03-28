import { MonitorAnalyticsDevice } from '@/types/monitors/monitor.analytics.type';
import { motion } from 'framer-motion';
import {
    Compass,
    ExternalLink,
    Globe,
    MapPin,
    Navigation,
} from 'lucide-react';


const getMapPos = (lat: number, lng: number) => {
    /**
     * CALIBRATION SETTINGS
     * Adjust these if the marker is slightly off:
     * horizontalShift: Moves left/right (positive moves right)
     * verticalShift: Moves up/down (positive moves down)
     * zoomLevel: Compresses or expands the spread of the points
     */
    const horizontalShift = 0;
    const verticalShift = 15;
    const zoomLevel = 1.0;


    let top = ((90 - lat) / 180) * 100;

    let left = ((lng + 180) / 360) * 100;

    const calibratedTop = (top * zoomLevel) + verticalShift;
    const calibratedLeft = (left * zoomLevel) + horizontalShift;

    return {
        top: `${Math.max(5, Math.min(95, calibratedTop))}%`,
        left: `${Math.max(5, Math.min(95, calibratedLeft))}%`
    };
};

const LocationStats = ({
    device
}: {
    device: MonitorAnalyticsDevice
}) => {
    const mapPos = getMapPos(device.lat, device.lng);

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full transition-all hover:shadow-md">

            {/* 1. Header Area */}
            <div className="p-7 pb-5 flex items-center h-fit justify-between border-b border-gray-50/80">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50/80 rounded-2xl text-rose-500 shadow-sm shadow-rose-100">
                        <MapPin size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Location Hub</h3>
                        <p className="text-xs text-gray-400 font-medium tracking-tight">Real-time deployment telemetry</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-gray-900 text-white rounded-2xl flex items-center gap-2.5 shadow-lg shadow-gray-200">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Lock</span>
                </div>
            </div>

            {/* 2. Content Area */}
            <div className="p-7 grow flex flex-col gap-6">

                {/* Physical Address Block */}
                <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 transition-colors hover:bg-gray-50">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Primary Placement</label>
                    <p className="text-sm font-extrabold text-gray-800 leading-relaxed">
                        {device.location ? device.location : 'INDIA'}
                    </p>
                </div>

                {/* Map Hero Block - The 'relative' class here is crucial */}
                <div className="relative h-64 w-full rounded-4xl overflow-hidden bg-slate-100 group shadow-inner border border-gray-100">

                    {/* The Map Background */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800')`,
                            filter: 'grayscale(100%) brightness(0.7) contrast(1.2)'
                        }}
                    />

                    {/* Color Overlay */}
                    <div className="absolute inset-0 bg-indigo-900/40 mix-blend-soft-light" />

                    {/* PULSE MARKER: Now inside the relative container */}
                    <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-in-out"
                        style={{ top: mapPos.top, left: mapPos.left }}
                    >
                        <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-16 w-16 rounded-full bg-indigo-400 opacity-20 animate-ping"></span>
                            <span className="absolute inline-flex h-8 w-8 rounded-full bg-indigo-500 opacity-10 animate-pulse"></span>
                            <div className="relative h-5 w-5 bg-indigo-600 border-[3px] border-white rounded-full shadow-2xl group/marker">
                                {/* Coordinates Tooltip on Hover */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity bg-gray-900 text-white text-[8px] px-2 py-1 rounded whitespace-nowrap shadow-xl">
                                    {device.lat.toFixed(2)}, {device.lng.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Serial Tag HUD */}
                    <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest">
                        <span className="text-indigo-300 mr-2">●</span> {device.serialNo}
                    </div>
                </div>

                {/* Coordinates Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Latitude Block */}
                    {/* Latitude Block */}
                    <motion.div
                        whileHover="hovered" // Trigger child animations named "hovered"
                        className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm cursor-default"
                    >
                        <motion.div
                            className="p-2 bg-indigo-50 text-indigo-500 rounded-xl transition-colors group-hover:bg-indigo-500 group-hover:text-white"
                            variants={{
                                hovered: {
                                    rotate: 360,
                                    transition: { type: "spring", stiffness: 60, damping: 15 }
                                }
                            }}
                        >
                            <Navigation size={18} />
                        </motion.div>
                        <div>
                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Latitude</span>
                            <span className="text-xs font-mono font-bold text-gray-700">{device.lat.toFixed(2)}</span>
                        </div>
                    </motion.div>

                    {/* Longitude Block */}
                    <motion.div
                        whileHover="hovered"
                        className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm cursor-default"
                    >
                        <motion.div
                            className="p-2 bg-emerald-50 text-emerald-500 rounded-xl transition-colors group-hover:bg-emerald-500 group-hover:text-white"
                            variants={{
                                hovered: {
                                    rotate: 360,
                                    transition: { type: "spring", stiffness: 60, damping: 15 }
                                }
                            }}
                        >
                            <Globe size={18} />
                        </motion.div>
                        <div>
                            <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Longitude</span>
                            <span className="text-xs font-mono font-bold text-gray-700">{device.lng.toFixed(2)}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Action Footer */}
            <div className="px-7 pb-7 mt-auto">
                <motion.a
                    href={`https://www.google.com/maps?q=${device.lat},${device.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, backgroundColor: "#000" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between px-6 py-5 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-200 group"
                >
                    <div className="flex items-center gap-4">
                        <Compass size={18} className="text-white group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-extrabold tracking-tight">Navigate via Google Maps</span>
                    </div>
                    <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </motion.a>
            </div>
        </div>
    );
};

export default LocationStats;