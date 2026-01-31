"use client"

import Link from "next/link";
import { http } from "@/lib/http";
import { useEffect, useState } from "react";
import Image from 'next/image'

import { Skeleton } from "@/components/ui/skeleton"
import { truncateText } from "@/helpers/truncateText";

interface MenuPostProps {
    withImage: boolean;
}

interface PopularPost {
    id: string;
    title: string;
    author: {
        id: string;
        usernmae: string;
        name: string;
    };
    img: string
    createdAt: string;
}



const MenuPosts = ({ withImage }: MenuPostProps) => {
    const [posts, setPosts] = useState<PopularPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const res = await http.get("/api/blog/most-popular");
                setPosts(res.data.posts || []);
            } catch (error) {
                console.error("Failed to load popular posts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPopularPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center flex-row space-x-4">
                <Skeleton className="h-10 w-12 rounded-full" />
                <Skeleton className="h-10 w-12 rounded-full" />
                <Skeleton className="h-10 w-12 rounded-full" />
            </div>
        )
    }

    return (
        <div className="mt-9 mb-16 flex flex-col gap-9">
            <div className="flex items-stretch gap-4">
                {posts.map((items: PopularPost, index: number) => (
                    <Link key={index} href={`
                        /blogs/${items.author.usernmae}/${items.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")}-${items.id}
                        `} >
                        <div

                            className="flex-1 flex flex-col justify-between min-h-[160px]"
                        >
                            <Image
                                src={items.img}
                                width={55}
                                height={20}
                                alt="Picture of the author"
                            />

                            <h3
                                className="text-sm pt-2 font-semibold text-gray-800 line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: truncateText(items.title, 5),
                                }}
                            />

                            <div className="flex flex-col md:items-start mt-2 px-0 text-sm text-gray-600">
                                <span className="pt-2 md:pt-0">{items.author.name}</span>
                                <br />
                                <span className="text-xs">10.02.2025</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    );
};

export default MenuPosts;