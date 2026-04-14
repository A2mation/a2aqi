'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Menu from "@/components/blog/Menu";
import Featured from "@/components/blog/Feature";
import { getCategoryData } from "@/store/category.actions";
import { BlogCardList } from "@/components/blog/BlogCardList";
import { CategoryList } from "@/components/blog/CategoryList";

export default function BlogPage() {
    const searchParams = useSearchParams();

    const page = Math.max(
        1,
        Number(searchParams.get("page") ?? 1)
    );

    const cat = searchParams.get("cat") ?? "";

    useEffect(() => {
        getCategoryData();
    }, []);

    return (

        <div className="bg-white text-black mt-30">
            <Featured />
            <CategoryList />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-12.5">
                <div className="md:col-span-4">
                    <BlogCardList page={page} cat={cat} />
                </div>

                <div className="md:col-span-1">
                    <Menu />
                </div>
            </div>

        </div>

    );
}
