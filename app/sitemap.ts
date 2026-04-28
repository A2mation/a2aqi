import type { MetadataRoute } from "next";

import { cities } from "@/data/popullar-cities";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.a2aqi.com";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    // DEDUPLICATE SETS
    // -------------------------
    const countrySet = new Set<string>();
    const stateSet = new Set<string>();
    const citySet = new Set<string>();
    const streetSet = new Set<string>();

    const dbLocations = await prisma.searchBasedLocation.findMany({
        select: {
            slug: true,
            city: true,
            state: true,
            country: true,
            updatedAt: true
        }
    });

    dbLocations.forEach(loc => {
        const co = slugify(loc.country || "India");
        const st = slugify(loc.state || '');
        const ct = slugify(loc.city || '');
        const streetSlug = loc.slug;

        if (co) countrySet.add(co);
        if (co && st) stateSet.add(`${co}/${st}`);
        if (co && st && ct) citySet.add(`${co}/${st}/${ct}`);

        if (co && st && ct && streetSlug) {
            streetSet.add(`${co}/${st}/${ct}/${streetSlug}`);
        }
    });

    cities.forEach(city => {
        const co = slugify(city.country);
        const st = slugify(city.state);
        const ct = slugify(city.name);
        const street = slugify(city.street);

        countrySet.add(co);
        stateSet.add(`${co}/${st}`);
        citySet.add(`${co}/${st}/${ct}`);
        if (street) {
            streetSet.add(`${co}/${st}/${ct}/${street}`);
        }
    });

    // -------------------------
    // GENERATE FINAL URLS
    // -------------------------

    // Countries (Priority 0.9)
    countrySet.forEach(path => {
        urls.push({ url: `${BASE_URL}/dashboard/${path}`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 });
    });

    // States (Priority 0.9)
    stateSet.forEach(path => {
        urls.push({ url: `${BASE_URL}/dashboard/${path}`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 });
    });

    // Cities (Priority 0.8)
    citySet.forEach(path => {
        urls.push({ url: `${BASE_URL}/dashboard/${path}`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 });
    });

    // Streets / Dynamic Locations (Priority 1.0)
    streetSet.forEach(path => {
        urls.push({ url: `${BASE_URL}/dashboard/${path}`, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 });
    });


    // -------------------------
    // BLOGS
    // -------------------------

    urls.push({
        url: `${BASE_URL}/blogs`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
    });


    const blogs = await prisma.blogPost.findMany({
        select: {
            id: true,
            title: true,
            updatedAt: true,
            author: {
                select: {
                    username: true,
                },
            },
        },
    });

    blogs.forEach((blog) => {
        const titleSlug = blog.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        const authorSlug = blog.author.username;

        const fullSlug = `${titleSlug}-${blog.id}`;

        urls.push({
            url: `${BASE_URL}/blogs/${authorSlug}/${fullSlug}`,
            lastModified: blog.updatedAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        });
    });


    return urls;
}
