import type { Metadata } from "next";

import { formatSlug } from "@/helpers/formatSlug";

function generateCityKeywords(city: string, state: string): string[] {
    return [
        `AQI ${city}`,
        `${city} AQI`,
        `Air quality ${city}`,
        `${city} air quality today`,
        `Live AQI ${city}`,
        `Real time AQI ${city}`,
        `AQI today ${city}`,
        `AQI now ${city}`,
        `AQI near me ${city}`,
        `${city} pollution level`,
        `${city} air pollution`,
        `${city} pollution today`,
        `${city} AQI live`,
        `${city} AQI index`,
        `${city} AQI map`,
        `PM2.5 ${city}`,
        `PM10 ${city}`,
        `PM2.5 levels ${city}`,
        `PM10 levels ${city}`,
        `${city} air quality index`,
        `Unhealthy air quality ${city}`,
        `Hazardous air quality ${city}`,
        `${city} pollution health effects`,
        `${city} air quality forecast`,
        `${city} AQI forecast`,
        `${city} pollution advisory`,
        `${city} AQI alert`,
        `${city} AQI by area`,
        `${city} AQI near me`,
        `${city} pollution map`,
        `${city} pollution data`,
        `${city} pollution monitoring`,
        `${city} air quality tracker`,
        `${city} AQI tracker`,
        `${city} pollution statistics`,
        `${city} traffic pollution`,
        `${city} industrial pollution`,
        `${city} construction dust`,
        `${city} urban air quality`,
        `${city} air purifier need`,
        `${city} air safety index`,
        `${city} breathing quality`,
        `${city} pollution report`,
        `${city} AQI health risk`,
        `${city} environment data`,
        `${city} air quality website`,
        `${city} AQI today live`,
        `${city} pollution index`,
        `${city} AQI a2aqi`
    ];
}
export async function generateMetadata({
    params
}: {
    params: Promise<{ country: string, state: string, city: string }>
}): Promise<Metadata> {

    const slug = await params;

    const city = formatSlug(slug.city);
    const state = formatSlug(slug.state);
    const country = formatSlug(slug.country);

    return {
        title: `${city} AQI – Live Air Quality Index & Pollution Levels`,
        description: `Check real-time AQI, PM2.5, PM10, and air pollution levels in ${city}, ${state}. Live air quality updates for ${city}.`,
        keywords: generateCityKeywords(city, state),
        alternates: {
            canonical: `/dashboard/${slug.country}/${slug.state}/${slug.city}`
        }
    };
}


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