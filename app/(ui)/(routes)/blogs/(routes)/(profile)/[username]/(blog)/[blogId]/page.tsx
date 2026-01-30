'use client'

import { use, useState, useEffect } from 'react'
import toast from "react-hot-toast";

import Menu from "@/components/blog/Menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from './components/Header'
import { BlogContentProps } from "@/types/type";
import { http } from "@/lib/http";

const SingleBlogPage = ({
  params,
}: {
  params: Promise<{ blogId: string, username: string }>
}) => {
  const { blogId, username } = use(params)
  const id = blogId.split("-").pop();
  const [blogContent, setBlogContent] = useState<BlogContentProps>();
  const [loading, setLoading] = useState(false);

  console.log(id)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const res = await http.get(
          `/api/blog/profile/${username}/blog/${id}`
        );
        console.log(res.data)

        setBlogContent(res.data);

      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
        setLoading(false);
      } finally {
        setLoading(false)
      }
    };

    getData();
  }, [id])


  if (!id) {
    return null;
  }

  if (loading || !blogContent) {
    return (
      <section className='flex flex-col mx-auto gap-4 my-5'>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[100%] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100%]" />
              <Skeleton className="h-4 w-[100%]" />
            </div>
          </div>
        ))}
      </section>
    )
  }

  return (
    <div className="bg-white mt-4 max-w-6xl mx-auto">
      <div className="bg-gradient-to-l from-sky-400 to-indigo-600 text-white px-4 py-15 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:justify-between">
          <div className="space-y-2">
            <h1
              className="text-3xl md:text-5xl font-bold leading-tight"
              dangerouslySetInnerHTML={{ __html: blogContent?.title }}
            />
          </div>

        </div>
      </div>
      <div className='m-2'>
        <Header
          user={blogContent.author}
          views={5}
          likedIds={["1", "2", "3"]}
          postId={id}
          likesCount={3}
          createdAt={blogContent.createdAt}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">

          <div className="flex-1 space-y-6">
            <p className='text-3xl font-extrabold' dangerouslySetInnerHTML={{ __html: blogContent?.title }} />
            <section>
              <p dangerouslySetInnerHTML={{ __html: blogContent?.desc }} />
            </section>
            {/* Handel Comment section */}
          </div>
          <aside className="w-full lg:w-56 flex-shrink-0 mt-8 lg:mt-0">
            <div className="sticky top-12 p-6 rounded-lg">
              <Menu />
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}

export default SingleBlogPage
