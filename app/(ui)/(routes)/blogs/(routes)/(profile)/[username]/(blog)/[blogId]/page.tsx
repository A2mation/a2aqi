"use client"

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TwitterShareButton, TwitterIcon,
  FacebookShareButton, FacebookIcon,
  LinkedinShareButton, LinkedinIcon,
  WhatsappShareButton, WhatsappIcon
} from 'next-share'

import Menu from "@/components/blog/Menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from './components/Header'
import { BlogContentProps } from "@/types/type";
import { http } from "@/lib/http";
import { Comments } from '@/components/blog/Comments';

const SingleBlogPage = ({
  params,
}: {
  params: Promise<{ blogId: string, username: string }>
}) => {
  const { blogId, username } = use(params)
  const id = blogId.split("-").pop();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { data: blogContent, isLoading, isError } = useQuery({
    queryKey: ['blog', id, username],
    queryFn: async () => {
      const res = await http.get(`/api/blog/profile/${username}/blog/${id}`);
      return res.data as BlogContentProps;
    },
    enabled: !!id,
    staleTime: 60000 * 5
  });

  if (isLoading) return <BlogLoadingSkeleton />;
  if (isError || !blogContent) return <ErrorState />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fafafa] dark:bg-slate-950 pb-20"
    >
      {/* Hero Header Section */}
      <div className="relative w-full h-[50vh] min-h-100 flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/10 to-[#fafafa] dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950 z-10" />

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity duration-700"
          style={{ backgroundImage: `url(${blogContent.img || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070'})` }}
        />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="
                px-5 py-2 rounded-full 
                bg-indigo-600 dark:bg-indigo-500/20 
                border border-indigo-700 dark:border-indigo-400/30 
                text-white dark:text-indigo-300 
                text-[10px] md:text-xs 
                font-black uppercase tracking-[0.3em] 
                shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]
              ">
              Feature Story
            </span>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter leading-[1.1]"
            dangerouslySetInnerHTML={{ __html: blogContent.title }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Functional Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-12 pt-32 sticky top-10 h-fit">
            <div className="flex flex-col gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xl">

              <TwitterShareButton url={shareUrl} title={blogContent.title}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={blogContent.title}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>

              <WhatsappShareButton url={shareUrl} title={blogContent.title} separator=":: ">
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

            </div>
            <p className="text-[10px] text-center font-bold uppercase text-slate-400 tracking-tighter">Share</p>
          </aside>

          {/* Article Card */}
          <main className="flex-1">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">

              <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                <Header
                  user={blogContent.author}
                  views={5}
                  likedIds={blogContent.likedIds}
                  postId={id!}
                  likesCount={blogContent.likesCount}
                  createdAt={blogContent.createdAt}
                />
              </div>

              <div className="px-8 py-1 md:px-16 md:pb-20 md:pt-1">
                <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                  prose-headings:tracking-tight prose-headings:font-bold 
                  prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                  prose-img:rounded-3xl prose-img:shadow-2xl">
                  <div className="tiptap" dangerouslySetInnerHTML={{ __html: blogContent.desc }} />
                </article>

                {/* Mobile Share Section */}
                <div className="lg:hidden mt-12 flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500">Share article:</span>
                  <div className="flex gap-2">
                    <TwitterShareButton url={shareUrl}><TwitterIcon size={32} round /></TwitterShareButton>
                    <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
                    <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
                  </div>
                </div>

                <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
                  <Comments postId={blogContent.id} />
                </div>
              </div>
            </div>
          </main>

          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-30 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                  Editor's Choice
                </h3>
                <Menu />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </motion.div>
  )
}

const BlogLoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto mt-40 px-6">
    <Skeleton className="h-4 w-24 mb-4 rounded-full" />
    <Skeleton className="h-16 w-full mb-8 rounded-xl" />
    <div className="flex gap-4 mb-12">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <div className="space-y-6">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-[90%]" />
      <Skeleton className="h-80 w-full rounded-3xl" />
    </div>
  </div>
);

const ErrorState = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center">
    <h2 className="text-2xl font-bold">Article not found</h2>
    <p className="text-slate-500">The story you're looking for has moved or doesn't exist.</p>
  </div>
);

export default SingleBlogPage;