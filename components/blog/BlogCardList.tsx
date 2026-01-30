"use client"
import {
  useEffect,
  useState
} from "react";
import Image from 'next/image'
import toast from "react-hot-toast";

import Pagination from "./Pagination";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOG_POST_PER_PAGE } from "@/constant/blog-per-page";
import { http } from "@/lib/http";
import { BlogContentProps } from "@/types/type"



interface BlogCardListProps {
  page: number;
  cat: string;
}


const dummyUser = {
  id: "user_001",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/150?img=3",
}



export const BlogCardList = ({ page, cat }: BlogCardListProps) => {
  const [post, setPost] = useState<BlogContentProps[]>([]);
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);



  const hasPrev = BLOG_POST_PER_PAGE * (page - 1) > 0;
  const hasNext = BLOG_POST_PER_PAGE * (page - 1) + BLOG_POST_PER_PAGE < postCount;

  useEffect(() => {

    const getData = async () => {
      try {
        setLoading(true);

        const res = await http.get(
          `/api/blog?page=${page}&cat=${cat || ""}`
        );
        // console.log(res.data)

        setPostCount(res.data.total);
        setPost(res.data.posts);

      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
        setLoading(false);
      } finally {
        setLoading(false)
      }
    };

    getData();

  }, [page, cat]);


  if (loading) {
    return (
      <section className='flex flex-col justify-center mx-auto gap-4 my-5'>
        <Skeleton className="h-15 w-[20%] rounded-xl" />
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-50 w-full rounded-xl" />
          </div>
        ))}
      </section>
    )
  }


  return (
    <div className="flex-5">
      <h1 className="my-8 text-3xl flex items-center gap-x-2 font-semibold">
        Recent Posts
        <Image src={'/assets/recent.webp'} width={40} height={40} alt="recent" />
      </h1>
      <div>
        {post?.map((item: BlogContentProps, index) => (
          <div key={index}>
            <BlogCard item={item} />
          </div>
        ))}

      </div>
      <Pagination page={page} hasNext={hasNext} hasPrev={hasPrev} />
    </div>
  );
};
