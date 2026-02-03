import React from 'react'

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learn About Air Pollution, AQI & Air Quality Pollutants",
    description:
        "Learn about air pollution, AQI, PM2.5, PM10, gases, humidity, noise pollution, and air quality factors that affect health and the environment.",
    keywords: [
        "What is air pollution",
        "Air quality education",
        "AQI explained",
        "Air pollution explained",
        "Air quality pollutants",
        "PM2.5 explained",
        "PM10 explained",
        "Carbon monoxide explained",
        "Carbon dioxide explained",
        "Nitrogen dioxide explained",
        "Sulfur dioxide explained",
        "Ozone explained",
        "Methane explained",
        "Ammonia explained",
        "Hydrogen sulfide explained",
        "Radon explained",
        "VOC explained",
        "Humidity air quality",
        "Noise pollution explained",
        "Pollen allergy air quality",
        "Air pollution health effects",
        "Air quality learning hub",
        "Environmental pollution education",
        "Indoor air quality explained",
        "Outdoor air quality explained",
        "Air quality basics India",
        "Pollution education India",
        "Air quality knowledge base",
        "Learn AQI",
        "Air pollution awareness"
    ],
    alternates: {
        canonical: "/learn"
    }
};


const Layout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <>
            {children}
        </>

    )
}

export default Layout