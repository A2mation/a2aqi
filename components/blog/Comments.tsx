"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { http } from "@/lib/http";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    postId: string;
}

type Comment = {
    id: string;
    desc: string;
    createdAt: string;
    author: {
        id: string
        name: string;
    };
};

export const userCommentsSchema = z.object({
    postId: z
        .string()
        .min(1, "Post ID is required"),

    comments: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment is too long"),
});

export const Comments = ({ postId }: Props) => {
    const { status } = useSession();
    const router = useRouter();
    const isAuthenticated = status === "authenticated";

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof userCommentsSchema>>({
        resolver: zodResolver(userCommentsSchema),
        defaultValues: {
            comments: "",
            postId,
        },
    });


    const fetchComments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await http.get(`/api/blog/comments?blogId=${postId}`);
            setComments(res.data);
        } catch {
            setError("Failed to load comments");
            toast.error("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const onSubmit = async (values: z.infer<typeof userCommentsSchema>) => {
        if (!isAuthenticated) {
            toast.error("Please login to comment");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await http.post("/api/blog/comments", values);
            if (res.status === 200) {
                toast.success("Comment added!");
                form.reset();
                fetchComments();
            } else {
                toast.error("Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="max-w-4xl mx-auto mt-20">
            <h2 className="text-3xl font-extrabold mb-6">Comments</h2>

            {/* Auth Guard */}
            {!isAuthenticated && (
                <div className="border rounded-lg p-6 mb-6 text-center bg-gray-50">
                    <LogIn className="mx-auto mb-2 h-6 w-6 text-gray-500" />
                    <p className="text-gray-600 mb-3">
                        You need to be logged in to comment.
                    </p>
                    <Button variant="outline" onClick={() => router.push('/blogs/sign-in')}>
                        Login to comment
                    </Button>
                </div>
            )}

            {/* Comment Form */}
            {isAuthenticated && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-400">
                                        Write your comment
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Share your thoughts..."
                                            className="h-24"
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                    </form>
                </Form>
            )}

            {/* Loading */}
            {isLoading && (
                <p className="text-center text-gray-500 mt-10">
                    Loading comments…
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-center text-red-500 mt-10">{error}</p>
            )}

            {/* Comments List */}
            <div className="mt-10 space-y-4">
                {comments.map((item) => (
                    <div
                        key={item.id}
                        className="border px-6 py-4 rounded-lg"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-semibold">{item.author.name}</p>
                                <p className="text-xs text-gray-500">
                                    {item.createdAt.substring(0, 10)}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
