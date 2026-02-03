import type { Metadata } from "next";

import { formatSlug } from "@/helpers/formatSlug";

export async function generateMetadata({
    params
}: {
    params: Promise<{ country: string, state: string }>
}): Promise<Metadata> {
    const slug = await params;
    const state = formatSlug(slug.state);
    const country = formatSlug(slug.country);

    return {
        title: `${state} AQI – Live Air Quality Index`,
        description: `Track real-time AQI and air pollution levels across cities in ${state}, ${country}.`,
        keywords: [
            `AQI ${state}`,
            `${state} AQI`,
            `Air quality ${state}`,
            `${state} air pollution`,
            `AQI cities in ${state}`,
            `PM2.5 ${state}`,
            `PM10 ${state}`,
            `${state} pollution map`,
            `${state} AQI live`,
            `${state} air quality index`
        ]
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