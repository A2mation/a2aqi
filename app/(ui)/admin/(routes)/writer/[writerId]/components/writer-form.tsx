"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { ContentWriter, ContentWriterStatus } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/alert-modal";


interface WriterFormProps {
    initialData: Partial<ContentWriter> | null
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    username: z.string().min(1, "Username is required"),
    password: z.string().optional(),
    status: z.enum(ContentWriterStatus),
});



type WriterFormValues = z.infer<typeof formSchema>

export const WriterForm = ({ initialData }: WriterFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Writer" : "Create Writer";
    const description = initialData ? "Edit a Writer" : "Add a new Writer";
    const toastMsg = initialData ? "Writer updated." : "Writer created.";
    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<WriterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            username: initialData?.username ?? "",
            password: "",
            status: initialData?.status ?? ContentWriterStatus.ACTIVE,
        },
    });
    // console.log(form.formState.errors);

    const onSubmit = async (data: WriterFormValues) => {
        try {
            setLoading(true);

            const payload = {
                ...data,
                ...(data.password ? {} : { password: undefined }),
            };

            if (!initialData && !payload.password) {
                form.setError('password', {
                    message: "Passoword cannot be empty for new user"
                })
                return
            }
            console.log(payload)
            // if (initialData) {
            //     await axios.patch(`/api/admin/${params.writerId}`, payload);
            // } else {
            //     await axios.post(`/api/admin`, payload);
            // }

            // router.push("/admin/writer");
            router.refresh();
            toast.success(toastMsg);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const onDelete = async () => {
        try {

            setLoading(true);
            await axios.delete(`/api/admin/${params.writerId}`);
            router.push(`/admin/writer`);
            router.refresh();
            toast.success("Writer Deleted.");

        } catch (error) {
            toast.error("Make sure you remove all Blogs written by the writer.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-between items-center">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Writer Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display Writer Name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email must be Unique"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public displayed email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username must be Unique"
                                            disabled={!!initialData}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {
                                            initialData
                                                ? "Username cannot be changed."
                                                : "This is your public displayed username."


                                        }
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={initialData ? "Leave blank to keep current password" : "Enter the new password"}
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {
                                            initialData
                                                ? "Only fill this if you want to change the password."
                                                : "This will be your new writer password."
                                        }
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={ContentWriterStatus.ACTIVE}>
                                                Active
                                            </SelectItem>
                                            <SelectItem value={ContentWriterStatus.INACTIVE}>
                                                Inactive
                                            </SelectItem>
                                            <SelectItem value={ContentWriterStatus.SUSPENDED}>
                                                Suspended
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Controls whether the writer can publish content.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading}
                            className=" hover:cursor-pointer "
                        >
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator />


        </>
    )
}