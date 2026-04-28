import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "A2AQI Blog – Air Quality Monitoring Insights & Articles",
        template: "%s | A2AQI Blog",
    },

    description:
        "Explore A2AQI blogs on air quality monitoring, AQI systems, pollution tracking, and environmental insights.",

    keywords: [
        "A2AQI blog",
        "A2MATION blog",
        "A2AQI articles",
        "A2AQI air quality blog",

        "air quality monitoring",
        "air quality monitoring blog",
        "AQI monitoring",
        "AQI articles",
        "AQI system",
        "AQI monitoring system",
        "air pollution monitoring",
        "pollution monitoring system",

        "what is AQI",
        "how AQI is measured",
        "how air quality is monitored",
        "air quality index explained",
        "pollution monitoring guide",
        "environmental monitoring systems",

        "industrial air quality monitoring",
        "smart city air quality monitoring",
        "municipal air quality systems",
        "real time AQI monitoring",
        "IoT air quality monitoring",

        "best air quality monitoring system",
        "air quality monitoring solutions",
        "AQI monitoring devices",
        "pollution tracking technology",
        "air pollution control insights",

        "environment blog",
        "environmental articles",
        "pollution blog",
        "sustainability blog",
        "climate and air quality blog",

        "blogs",
        "tech blog environment",
        "data driven air quality insights",
    ],

    metadataBase: new URL("https://www.a2aqi.com"),

    alternates: {
        canonical: "/blogs",
    },

    openGraph: {
        title: "A2AQI Blog",
        description:
            "Latest insights on air quality monitoring, AQI systems, and pollution tracking.",
        url: "https://www.a2aqi.com/blogs",
        siteName: "A2AQI",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "A2AQI Blog",
        description:
            "Insights on AQI monitoring, pollution tracking, and air quality systems.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

const BlogDashboardLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <>
            <Suspense>
                <div className='max-w-7xl mx-auto mt-20 px-2 md:px-0'>
                    {children}
                </div>
            </Suspense>
        </>

    )
}

export default BlogDashboardLayout