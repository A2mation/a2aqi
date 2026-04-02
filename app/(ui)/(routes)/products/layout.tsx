import React from 'react'

export const metadata = {
    title: "Industrial Air Quality Monitors & CAAQMS Displays",
    description: "A2aqi provides high-precision CAAQMS displays, dust monitors, and environmental sensors for industrial, indoor, and outdoor monitoring. Fast-track delivery across India.",
    keywords: [

        "a2aqi",
        "a2aqi.com",
        "A2MATION TECHNOLOGY SOLUTION",

        "CAAQMS Display Board",
        "Industrial AQI Monitor",
        "Outdoor Air Quality Display",
        "Continuous Ambient Air Quality Monitoring System",
        "Pollution Display Board",

        "PM2.5 PM10 Monitor",
        "Real-time Dust Monitoring System",
        "Environmental Sensor Network",
        "IoT Air Quality Device",

        "Industrial Safety Equipment India",
        "Smart City Pollution Display",
        "Factory Air Quality Monitoring",
        "Weather Monitoring Station"
    ],
    alternates: {
        canonical: "https://www.a2aqi.com/products",
    },
    openGraph: {
        title: "Industrial AQI Monitors & Displays | a2aqi",
        description: "Premium CAAQMS and environmental monitoring solutions by a2aqi.",
        url: "https://www.a2aqi.com/products",
        siteName: "a2aqi",
        images: [
            {
                url: "https://www.a2aqi.com/favicon.png",
                width: 1200,
                height: 630,
                alt: "a2aqi Industrial Monitors",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
};

const Layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>

            {children}

        </>
    )
}

export default Layout