import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { format } from "date-fns";

import { truncateText } from "@/helpers/truncateText";
import { BlogContentProps } from "@/types/type";



export interface PropsBlogCard {
    item: BlogContentProps
}


export const BlogCard = ({ item }: PropsBlogCard) => {

    const createdAt = useMemo(() => {
        if (item.createdAt == null) {
            return null
        }
        return format(new Date(item.createdAt), 'MMMM yyyy');
    }, [item.createdAt])

    return (
        (<div className=" mx-auto p-1 my-2">
            <div className="flex flex-col py-6 md:flex-row md:items-center bg-white rounded-lg shadow-lg overflow-hidden">
                {item?.img && (
                    <img
                        alt="Coastal town"
                        className="h-fit w-fit md:h-auto md:w-1/2 p-2 rounded-lg aspect-video"
                        src={item.img}
                        style={{
                            objectFit: "cover",
                            maxWidth: "100%",
                            height: "auto"
                        }} />

                )}
                <div className="pl-6 pr-2 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                        <div className="text-gray-900 font-bold text-xl mb-6" dangerouslySetInnerHTML={{
                            __html: item.title
                        }}>
                        </div>
                        <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{
                            __html: truncateText(item.desc, 40)
                        }}>

                        </p>
                    </div>
                    <div className="flex items-center">
                        <div className="text-sm">
                            <p className="text-gray-900 leading-none">{createdAt}</p>
                            <Link
                                className="text-blue-500 hover:text-red-400 hover:underline"
                                href={`blogs/${item.author.username}/${item.title
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-+|-+$/g, "")}-${item.id}`}

                            >
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    );
};

