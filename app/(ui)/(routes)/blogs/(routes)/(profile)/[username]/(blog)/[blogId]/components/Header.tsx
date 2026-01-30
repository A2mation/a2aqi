"use client"


import {
    useState
} from 'react'
import {
    ThumbsUp,
    User,
    Facebook,
    LinkedinIcon,
    Eye,
    Twitter
} from 'lucide-react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from "react-share";

import {
    AvatarImage,
    AvatarFallback,
    Avatar
} from "@/components/ui/avatar"

import { Button } from '@/components/ui/button';
import { Author } from '@/types/type';

interface UserProps {
    user: Author,
    views: number,
    likedIds: string[],
    postId: string,
    likesCount: number
    createdAt: Date
}

export const Header = (user: UserProps) => {
    const [isLoading, setIsLoading] = useState(false);
    // TODO:: Handel Like and unlike post



    return (
        <div>
            <div className="max-w-6xl mx-auto p-4 border-y-2">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Avatar>
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{user.user.name}</span>
                            <span className="text-xs text-gray-500">Published in The A2aqi Blogs • 7 min read • {user.createdAt.toString().substring(0, 10)}</span>
                        </div>
                    </div>
                    <div className='flex justify-between gap-2'>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Button
                                    size="icon"
                                    variant="link"
                                    disabled={isLoading}
                                >
                                    <ThumbsUp
                                        className="h-5 w-5 text-gray-500 "
                                        color='red'
                                        size={20}

                                    />
                                </Button>


                                <span className="text-sm">{user.likesCount}</span>
                            </div>

                            <div className='flex'>
                                <FacebookShareButton
                                    url='a2aqi.com'
                                    title='Shareing this Blog from A2AQI'
                                    hashtag='#a2aqi'

                                >
                                    <Facebook color='blue' className="h-5 w-5 text-gray-500" />
                                </FacebookShareButton>
                            </div>
                            <div className='flex'>
                                <TwitterShareButton
                                    url='a2aqi.com'
                                    title='Shareing this Blog from A2AQI'
                                    hashtags={["a2aqi"]}
                                >
                                    <Twitter color='blue' className="h-5 w-5 text-gray-500" />
                                </TwitterShareButton>
                            </div>
                            <div className='flex'>
                                <LinkedinShareButton
                                    url='a2aqi.com'
                                    title='Shareing this Blog from A2AQI'
                                    summary='This is the description'
                                >
                                    <LinkedinIcon color='blue' className="h-5 w-5 text-gray-500" />
                                </LinkedinShareButton>
                            </div>

                            <div className='flex items-center space-x-1'>
                                <Eye color='black' className="h-5 w-5 text-gray-500" />
                                <span className='text-sm'>{user.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

