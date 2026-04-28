import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";



export async function generateMetadata({
    params,
}: {
    params: Promise<{ blogId: string, username: string }>
}): Promise<Metadata> {

    const {
        blogId, username
    } = await params;
    const id = extractId(blogId);

    if (!id) {
        return {
            title: "Blog Not Found",
        };
    }

    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
            author: true,
            categories: {
                include: {
                    category: true
                }
            },
        },
    });

    if (!post) {
        return {
            title: "Blog Not Found",
            description: "This blog does not exist.",
        };
    }

    const titleKeywords = generateNGrams(post.title);

    const keywords = [
        `${post.title} blog`,
        `${post.title} article`,
        ...titleKeywords.slice(0, 15),
        ...(post.categories?.map((c) => c.category.slug.toLowerCase()) || []),
        "air quality monitoring",
        "AQI system",
        "pollution monitoring",
        "what is AQI monitoring",
        "air quality monitoring system",
        'a2mation',
        'a2aqi blogs'
    ];

    const fullUrl = `https://www.a2aqi.com/blogs/${username}/${blogId}`;

    return {
        title: post.title,
        description: post.desc,
        keywords,

        metadataBase: new URL("https://www.a2aqi.com"),
        alternates: {
            canonical: fullUrl,
        },

        openGraph: {
            title: post.title,
            description: post.desc,
            url: fullUrl,
            siteName: "A2AQI",
            images: post.img ? [post.img] : [],
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author?.name || "Author"],
        },

        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.desc,
            images: post.img ? [post.img] : [],
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}


const SingleBlogPageLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <>
            {children}
        </>

    )
}

export default SingleBlogPageLayout;


function extractId(slug: string) {
    const parts = slug.split("-");
    return parts[parts.length - 1];
}

function generateNGrams(title: string) {
    const clean = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

    const bigrams = clean.slice(0, -1).map((_, i) => {
        return `${clean[i]} ${clean[i + 1]}`;
    });

    const trigrams = clean.slice(0, -2).map((_, i) => {
        return `${clean[i]} ${clean[i + 1]} ${clean[i + 2]}`;
    });

    return [...new Set([...bigrams, ...trigrams])];
}