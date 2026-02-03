import type { Metadata } from "next";

import { formatSlug } from "@/helpers/formatSlug";

export async function generateMetadata({
    params
}: {
    params: Promise<{ country: string }>
}): Promise<Metadata> {
    const slug = await params;
    const country = formatSlug(slug.country);

    return {
        title: `${country} AQI – Live Air Quality Index`,
        description: `Live AQI and air pollution data across major cities in ${country}.`,
        keywords: [
            `AQI ${country}`,
            `Air quality ${country}`,
            `${country} air pollution`,
            `${country} AQI today`,
            `PM2.5 ${country}`,
            `PM10 ${country}`,
            `${country} pollution levels`
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