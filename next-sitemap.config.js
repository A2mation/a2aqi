const { cities } = require("./data/cities.sitemap");

const slugify = str =>
    str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://a2aqi.com",
    generateRobotsTxt: true,

    sitemapSize: 5000,
    changefreq: "hourly",
    priority: 0.7,

    exclude: ["/_not-found", "/404", "/500"],

    additionalPaths: async () => {
        const paths = [];

        // ----------------------------
        // STATIC ROUTES
        // ----------------------------
        [
            "/",
            "/about-us",
            "/contact-us",
            "/air-quality-map",
            "/learn",
        ].forEach(route => {
            paths.push({
                loc: route,
                changefreq: "weekly",
                priority: 0.8,
            });
        });

        // ----------------------------
        // LEARN TOPICS
        // ----------------------------
        [
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
        ].forEach(topic => {
            paths.push({
                loc: `/learn/${topic}`,
                changefreq: "monthly",
                priority: 0.6,
            });
        });

        // ----------------------------
        // DEDUPLICATE COUNTRY & STATE
        // ----------------------------
        const countrySet = new Set();
        const stateSet = new Set();

        cities.forEach(c => {
            countrySet.add(slugify(c.country));
            stateSet.add(
                `${slugify(c.country)}/${slugify(c.state)}`
            );
        });

        countrySet.forEach(country => {
            paths.push({
                loc: `/dashboard/${country}`,
                changefreq: "hourly",
                priority: 0.9,
            });
        });

        stateSet.forEach(statePath => {
            paths.push({
                loc: `/dashboard/${statePath}`,
                changefreq: "hourly",
                priority: 0.9,
            });
        });

        // ----------------------------
        // CITY PAGES
        // ----------------------------
        cities.forEach(c => {
            paths.push({
                loc: `/dashboard/${slugify(c.country)}/${slugify(
                    c.state
                )}/${slugify(c.name)}`,
                changefreq: "hourly",
                priority: 1.0,
            });
        });

        return paths;
    },
};
