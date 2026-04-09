import type { Metadata } from "next";
import { formatSlug } from "@/helpers/formatSlug";

function generateStreetKeywords(street: string, city: string, state: string): string[] {
    return [
        `AQI ${street}`,
        `${street} AQI`,
        `${street} air quality`,
        `${street} air quality today`,
        `Live AQI ${street}`,
        `Real time AQI ${street}`,
        `AQI today ${street}`,
        `AQI near me ${street}`,
        `${street} pollution level`,
        `${street} air pollution`,
        `${street}, ${city} AQI`,
        `${street} ${city} air quality`,
        `${street} pollution today`,
        `${street} AQI live`,
        `${street} AQI index`,
        `${street} AQI map`,
        `PM2.5 ${street}`,
        `PM10 ${street}`,
        `${street} air quality index`,
        `${street} pollution health effects`,
        `${street} AQI forecast`,
        `${street} pollution advisory`,
        `${street} AQI alert`,
        `${street} pollution map`,
        `${street} pollution data`,
        `${street} air quality tracker`,
        `${street} AQI tracker`,
        `${street} pollution statistics`,
        `${street} traffic pollution`,
        `${street} urban air quality`,
        `${street} AQI today live`,
        `${street} pollution index`,
        `${street} AQI a2aqi`
    ];
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ country: string, state: string, city: string, street: string }>
}): Promise<Metadata> {

    const slug = await params;

    const street = formatSlug(slug.street);
    const city = formatSlug(slug.city);
    const state = formatSlug(slug.state);
    const country = formatSlug(slug.country);

    return {
        title: `${street}, ${city} AQI – Live Air Quality Index`,
        description: `Check real-time AQI, PM2.5, PM10, and air pollution levels on ${street}, ${city}, ${state}, ${country}. Live air quality updates.`,
        keywords: generateStreetKeywords(street, city, state),
        alternates: {
            canonical: `/dashboard/${slug.country}/${slug.state}/${slug.city}/${slug.street}`
        }
    };
}

const SingleStreetPageLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    return <>{children}</>;
};

export default SingleStreetPageLayout;