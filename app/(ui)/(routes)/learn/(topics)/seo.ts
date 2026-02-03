import type { Metadata } from "next";

export function createLearnMetadata(topic: string, slug: string): Metadata {
    return {
        title: `What Is ${topic}? Meaning, Sources & Health Effects`,
        description: `Learn what ${topic.toLowerCase()} is, its sources, health effects, and how it impacts air quality and pollution.`,
        keywords: [
            `What is ${topic}`,
            `${topic} meaning`,
            `${topic} definition`,
            `${topic} explained`,
            `${topic} air pollution`,
            `${topic} air quality`,
            `${topic} health effects`,
            `${topic} sources`,
            `${topic} causes`,
            `${topic} effects`,
            `${topic} exposure`,
            `${topic} safety limits`,
            `${topic} levels`,
            `${topic} monitoring`,
            `${topic} measurement`,
            `${topic} environmental impact`,
            `${topic} indoor exposure`,
            `${topic} outdoor exposure`,
            `${topic} pollution India`,
            `${topic} AQI`,
            `${topic} harmful effects`
        ],
        alternates: {
            canonical: `/learn/${slug}`
        }
    };
}
