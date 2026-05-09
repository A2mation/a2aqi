'use client'

import toast from "react-hot-toast"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, SendHorizontal } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Category } from "@/store/category.store"
import BlogEditor from "@/components/blog/BlogEditor"
import ImageUpload from "@/components/blog/ImageUpload"
import { MultiSelect } from "@/components/ui/multi-select"
import EmptyParamsErrorState from "./components/EmptyParamsErrorState"
import { BlogContentProps } from "@/types/type"
import BlogEditLoader from "./components/BlogEditLoader"


const titleChecker = (data: string) => data.trim().length >= 5
const blogChecker = (data: string) => data.trim().length >= 50

const EditBlogPage = () => {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    const username = searchParams.get("username")
    const blogId = searchParams.get("blogId")

    const [tags, setTags] = useState<Category[]>([])
    const [blog, setBlog] = useState("")
    const [title, setTitle] = useState("")
    const [img, setImg] = useState<string | undefined>()

    const resetForm = () => {
        setTags([]);
        setBlog("");
        setTitle("");
        setImg(undefined);
    }

    const { data: blogData, isLoading: isFetching, error: isblogPending } = useQuery<BlogContentProps>({
        queryKey: ["blog", blogId, username],
        queryFn: async () => {
            const res = await http.get(`/api/blog/profile/${username}/blog/${blogId}`);

            if (res.status === 200) {
                return res.data;
            }
        },
        enabled: !!blogId && !!username,
        staleTime: 60000 * 5
    });
    console.log(blogData)
    useEffect(() => {
        if (blogData) {
            setTitle(blogData.title);
            setBlog(blogData.desc);
            setTags(blogData.categories);
            setImg(blogData.img);
        }
    }, [blogData]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate BEFORE firing the mutation
        if (!titleChecker(title)) return toast.error("Title must be at least 5 characters.");
        if (!blogChecker(blog)) return toast.error("Content must be at least 50 characters.");
        if (tags.length === 0) return toast.error("Please select at least one category.");

        updateBlog({ title, blog, tags, img });
    };

    const { mutate: updateBlog, isPending: isUpdating, error: isUpdateError } = useMutation({
        mutationFn: async (updatedData: any) => {
            const res = await http.patch(
                `/api/blog/profile/${username}/blog/${blogId}`,
                updatedData
            );

            if (res.status === 200 || res.status === 201) {
                return res.data;
            }

            throw new Error(res.data.message || 'Something Went Wrong');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog", blogId, username] });
            resetForm();
            router.back();
            toast.success("Blog updated successfully!");
        },
        onError: (error: any) => {
            toast.error("Failed to update blog.");
            console.error(error);
        },
    });

    const isLoading = isFetching || isUpdating;


    if (!blogId || !username) {
        return <EmptyParamsErrorState />;
    }

    if (isFetching) {
        return <BlogEditLoader />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto my-15 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-4xl shadow-sm"
        >
            <div className="p-8 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-4xl tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        Update Story <Plus className="text-indigo-600" size={32} />
                    </h1>
                    <p className="text-slate-500 mt-1">Edit your thoughts.</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="p-8 space-y-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Classification</Label>
                        <MultiSelect
                            value={tags || []}
                            onChange={setTags}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Cover Media</Label>
                        <ImageUpload
                            value={img}
                            onChange={setImg}
                            label="Click to upload thumbnail"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Headline</Label>
                    <input
                        value={title}
                        disabled={isLoading}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a catchy title..."
                        className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800 p-0 outline-none transition-all"
                    />
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-900" />
                </div>

                {/* Blog Body */}
                <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-widest text-slate-400">Story Content</Label>
                    <div className={`transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <BlogEditor
                            value={blog}
                            onChange={setBlog}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-50 dark:border-slate-900">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="rounded-full px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform flex gap-2 shadow-xl"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Update Post <SendHorizontal size={18} />
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}

export default EditBlogPage