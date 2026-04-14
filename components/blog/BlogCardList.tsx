"use client";

import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import Pagination from "./Pagination";
import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOG_POST_PER_PAGE } from "@/constant/blog-per-page";
import { http } from "@/lib/http";
import { BlogContentProps } from "@/types/type";

interface BlogCardListProps {
  page: number;
  cat: string;
}

export const BlogCardList = ({ page, cat }: BlogCardListProps) => {
  // TanStack Query replaces useEffect and manual state management
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["blog-posts", page, cat],
    queryFn: async () => {
      const res = await http.get(`/api/blog?page=${page}&cat=${cat || ""}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5000 * 5,
  });

  const posts = data?.posts || [];
  const postCount = data?.total || 0;

  const hasPrev = BLOG_POST_PER_PAGE * (page - 1) > 0;
  const hasNext = BLOG_POST_PER_PAGE * (page - 1) + BLOG_POST_PER_PAGE < postCount;

  if (isLoading) return <BlogLoadingSkeleton />;

  return (
    <div className="flex-5 min-h-screen pb-20">

      <header className="relative flex flex-col md:flex-row md:items-end justify-between mb-5 gap-6">
        <div className="space-y-3 mt-15 relative">

          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-500 to-purple-600 rounded-full hidden lg:block" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest"
          >
            <span>Exploration</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span>{cat || "All Categories"}</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white flex items-center gap-4">
            Recent <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Stories</span>
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Image
                src={'/assets/recent.webp'}
                width={48}
                height={48}
                alt="recent"
                className="drop-shadow-2xl filter saturate-150"
              />
            </motion.div>
          </h1>
          <p className="max-w-md text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
            Curated insights and deep dives into technology, design, and modern lifestyle.
          </p>
        </div>


        <div className="hidden md:block text-right">
          <span className="text-4xl font-light text-slate-300 dark:text-slate-700 tabular-nums">
            {String(posts.length).padStart(2, '0')}
          </span>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Posts Visible</p>
        </div>
      </header>


      <div className={`transition-all duration-500 ${isFetching ? 'opacity-40 blur-[2px] grayscale' : 'opacity-100 blur-0 grayscale-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page + cat}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 md:gap-8"
          >
            {posts.length > 0 ? (
              posts.map((item: BlogContentProps, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <BlogCard item={item} />


                  <div className="mt-5 md:mt-5 w-full h-px bg-slate-100 dark:bg-slate-800 group-last:hidden overflow-hidden">
                    <div className="w-full h-full bg-linear-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/20"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-900 dark:text-white">Quiet in here...</h3>
                <p className="text-slate-500 mt-2">We haven't published anything in <b>{cat}</b> just yet.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination with "Floating" style */}
      <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
        <Pagination page={page} hasNext={hasNext} hasPrev={hasPrev} />
      </div>

    </div >
  );
};

const BlogLoadingSkeleton = () => (
  <section className='flex flex-col gap-10 my-12'>
    <div className="space-y-3">
      <Skeleton className="h-10 w-62.5 rounded-full" />
      <Skeleton className="h-4 w-37.5 rounded-full" />
    </div>
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-64 w-full md:w-100 rounded-3xl" />
        <div className="flex-1 space-y-4 py-2">
          <Skeleton className="h-4 w-25" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    ))}
  </section>
);