"use main"

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Tv, ArrowRight } from "lucide-react";

interface TabContent {
  id: string;
  label: string;
  icon: React.ReactNode;
  tagline: string;
  title: string;
  description: string;
  appStoreUrl: string;
  playStoreUrl: string;
  mockupImage: string;
}

const tabData: TabContent[] = [
  {
    id: "mobile-app",
    label: "A2AQI Mobile App",
    icon: <Smartphone className="w-4 h-4" />,
    tagline: "Mobile App",
    title: "Seamless Connectivity",
    description: "Stay informed with real-time updates and personalized alerts on your mobile app, ensuring you always know the air quality around you, wherever you are.",
    appStoreUrl: "/products",
    playStoreUrl: "/products",
    mockupImage: "/assets/gallery/watching-mobile.png"
  },
  {
    id: "web-dashboard",
    label: "Web-Dashboard",
    icon: <Monitor className="w-4 h-4" />,
    tagline: "Analytics Suite",
    title: "Enterprise Web Control",
    description: "Monitor multiple sensor locations simultaneously with highly customizable heatmaps, historical data analytics, and advanced export tools built right into your browser.",
    appStoreUrl: "/products",
    playStoreUrl: "/products",
    mockupImage: "/assets/gallery/watching-laptop.png"
  },
  {
    id: "tv-app",
    label: "A2AQI TV App",
    icon: <Tv className="w-4 h-4" />,
    tagline: "Public Display",
    title: "Broadscale Visualization",
    description: "Perfect for office lobbies, schools, and public spaces. Showcase your ambient air metrics clearly on large displays with fully optimized, auto-refreshing TV interfaces.",
    appStoreUrl: "/products",
    playStoreUrl: "/products",
    mockupImage: "/assets/gallery/watching-tv.png"
  }
];

export default function ConnectivitySection() {
  const [activeTab, setActiveTab] = useState<string>(tabData[0].id);

  const currentTab = tabData.find((tab) => tab.id === activeTab) || tabData[0];

  return (
    <section className="w-full max-w-400 mx-auto px-8 py-16 sm:px-6 lg:px-8 font-sans">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-start">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 lg:col-span-7 leading-[1.15]">
          Seamless Connectivity <br className="hidden sm:inline" />
          for Air Quality Monitoring
        </h2>
        <p className="text-base sm:text-lg text-slate-600 lg:col-span-5 lg:pt-2">
          Connect your advanced air quality monitoring devices effortlessly, designed for seamless integration with high-end AQI visualization platforms.
        </p>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar mb-10 gap-2 sm:gap-4">
        {tabData.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors duration-200 whitespace-nowrap outline-none`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className={`${isSelected ? "text-emerald-600" : "text-slate-500"}`}>
                {tab.icon}
              </span>
              <span className={`${isSelected ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>
                {tab.label}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.75 bg-emerald-500 rounded-t-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-4xl border border-slate-100 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 items-center"
          >
            {/* Left Column:  content */}
            <div className="p-8 sm:p-12 lg:col-span-5 flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm tracking-wide uppercase mb-3">
                <span>{currentTab.tagline}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                {currentTab.title}
              </h3>

              <p className="text-slate-600 text-base font-semibold leading-relaxed mb-8">
                {currentTab.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 items-center mt-auto">
                <Link
                  href={currentTab.appStoreUrl}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-sm hover:shadow group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

              </div>
            </div>

            {/* Right Column: Image*/}
            <div className="lg:col-span-7 bg-slate-100/50 min-h-80 sm:min-h-110 flex items-center justify-center p-6 border-t lg:border-t-0 lg:border-l border-slate-100 relative rounded-r-3xl">

              <div className="absolute w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />

              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                src={currentTab.mockupImage}
                alt={`${currentTab.label} Display Preview`}
                className="max-h-95 w-auto object-contain rounded-xl shadow-lg border border-slate-200/60"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}