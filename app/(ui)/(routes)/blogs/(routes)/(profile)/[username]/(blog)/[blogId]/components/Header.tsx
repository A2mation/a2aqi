"use client";

import { useEffect, useState } from "react";
import {
    ThumbsUp,
    User,
    Facebook,
    LinkedinIcon,
    Eye,
    Twitter,
    Edit,
} from "lucide-react";
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from "react-share";
import toast from "react-hot-toast";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Author } from "@/types/type";
import useLike from "@/hooks/useLike";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface UserProps {
    user: Author;
    authorId: string;
    href: string;
    views: number;
    likedIds: string[];
    postId: string;
    likesCount: number;
    createdAt: Date;
}

export const Header = ({
    user,
    views,
    likedIds,
    postId,
    likesCount,
    createdAt,
    authorId,
    href
}: UserProps) => {
    const {
        hasLiked,
        toggleLike,
        isLoading,
        success,
        error,
        isAuthenticated,
    } = useLike({
        postId,
        likedIds,
    });
    const session = useSession();


    const [localHasLiked, setLocalHasLiked] = useState(hasLiked);
    const [localLikes, setLocalLikes] = useState(likesCount);


    useEffect(() => {
        setLocalHasLiked(hasLiked);
    }, [hasLiked]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to like this post");
            return;
        }


        setLocalHasLiked((prev) => !prev);
        setLocalLikes((prev) => (localHasLiked ? prev - 1 : prev + 1));

        await toggleLike();
    };


    useEffect(() => {
        if (!error) return;

        setLocalHasLiked((prev) => !prev);
        setLocalLikes((prev) => (localHasLiked ? prev + 1 : prev - 1));

        toast.error(error);
    }, [error]);


    useEffect(() => {
        if (!success) return;

        toast.success(localHasLiked ? "Post liked" : "Post unliked");
    }, [success, localHasLiked]);

    return (
        <div className="max-w-6xl mx-auto p-4 border-y-2">
            <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Author */}
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <Avatar>
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-gray-500">
                            Published in The A2aqi Blogs • 7 min read •{" "}
                            {createdAt.toString().substring(0, 10)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Like */}
                    <div className="flex items-center space-x-1">
                        <Tooltip>
                            <TooltipTrigger asChild>

                                <Button
                                    size="icon"
                                    variant="link"
                                    disabled={isLoading}
                                    onClick={handleLike}
                                    className="hover:cursor-pointer"
                                >
                                    <ThumbsUp
                                        className={`transition-colors duration-200 ${localHasLiked ? "text-blue-600" : "text-gray-600"
                                            }`}
                                        fill={localHasLiked ? "currentColor" : "none"}
                                    />
                                </Button>
                            </TooltipTrigger>

                            <span className="text-sm">{localLikes}</span>
                            <TooltipContent>
                                <p>{localHasLiked ? "Already Liked" : "Like this post"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Share */}
                    <FacebookShareButton url="https://a2aqi.com">
                        <Facebook className="h-5 w-5 text-blue-600" />
                    </FacebookShareButton>

                    <TwitterShareButton url="https://a2aqi.com">
                        <Twitter className="h-5 w-5 text-blue-600" />
                    </TwitterShareButton>

                    <LinkedinShareButton url="https://a2aqi.com">
                        <LinkedinIcon className="h-5 w-5 text-blue-600" />
                    </LinkedinShareButton>


                    {/* Views */}
                    <div className="flex items-center space-x-1">
                        <Eye className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">{views}</span>
                    </div>


                    {
                        (session && session.data?.user.id === authorId) && <>
                            <Link
                                className={cn(buttonVariants({
                                    variant: 'outline'
                                }))}
                                href={href}
                            >
                                <Edit className='h-4 w-4' />
                            </Link>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};
