import type { MetadataRoute } from "next";
import { cities } from "@/data/popullar-cities";

const BASE_URL = "https://www.a2aqi.com";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
    const urls: MetadataRoute.Sitemap = [];

    // -------------------------
    // STATIC ROUTES
    // -------------------------
    const staticRoutes = [
        "/",
        "/about-us",
        "/contact-us",
        "/air-quality-map",
        "/learn",
    ];

    staticRoutes.forEach(route => {
        urls.push({
            url: `${BASE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        });
    });

    // -------------------------
    // LEARN TOPICS
    // -------------------------
    const learnTopics = [
        "what-is-air-pollution",
        "what-is-ammonia",
        "what-is-carbon-dioxide",
        "what-is-carbon-monoxide",
        "what-is-humidity",
        "what-is-hydrogen-sulfide",
        "what-is-methane",
        "what-is-nitrogen-dioxide",
        "what-is-noise-pollution",
        "what-is-ozone",
        "what-is-particulate-matter-pm",
        "what-is-pollen",
        "what-is-radon",
        "what-is-sulfur-dioxide",
        "what-is-voc",
    ];

    urls.push({
        url: `${BASE_URL}/learn`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
    })

    learnTopics.forEach(topic => {
        urls.push({
            url: `${BASE_URL}/learn/${topic}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        });
    });

    // -------------------------
    // Diffrent Sectors
    // -------------------------
    const sectors = [
        'air-quality-monitoring-construction-sites',
        'air-quality-monitoring-hospital-sites',
        'air-quality-monitoring-smart-cities',
        'air-quality-monitoring-industries'
    ]

    sectors.forEach(sector => {
        urls.push({
            url: `${BASE_URL}/${sector}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        })
    })

    // -------------------------
    // DEDUPLICATE COUNTRY & STATE
    // -------------------------
    const countrySet = new Set<string>();
    const stateSet = new Set<string>();

    cities.forEach(city => {
        countrySet.add(slugify(city.country));
        stateSet.add(
            `${slugify(city.country)}/${slugify(city.state)}`
        );
    });

    countrySet.forEach(country => {
        urls.push({
            url: `${BASE_URL}/dashboard/${country}`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        });
    });

    stateSet.forEach(statePath => {
        urls.push({
            url: `${BASE_URL}/dashboard/${statePath}`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        });
    });

    // -------------------------
    // CITY ROUTES
    // -------------------------
    cities.forEach(city => {
        urls.push({
            url: `${BASE_URL}/dashboard/${slugify(
                city.country
            )}/${slugify(city.state)}/${slugify(city.name)}`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1.0,
        });
    });

    return urls;
}
