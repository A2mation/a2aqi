'use client'

import { useState } from "react"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    username: z.string().min(2, "Username is required"),
    email: z.email("Enter a valid email"),
    permission: z.enum(["READ", "READ_WRITE"]),
    password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export interface TeamDetailsProps {
    name: string;
    username: string;
    email: string;
    permission: "READ" | "READ_WRITE";
    password: string;
    status: string
    linkedMaster: string
    planEndingDate: string
    initials: string

}

interface AddTeamMemberProps {
    initialData?: TeamDetailsProps;
    triggerText?: string;
    className?: string;
}

export const AddTeamMember = ({ initialData, triggerText, className }: AddTeamMemberProps) => {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            username: initialData?.username || "",
            email: initialData?.email || "",
            permission: initialData?.permission || "READ",
            password: "",
        },
    });

    function onSubmit(values: FormValues) {
        console.log(values);

        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button */}
            <DialogTrigger asChild>
                {initialData ? (
                    <Button variant={"ghost"} size={"icon"} className="flex items-center justify-start gap-2 px-2 cursor-pointer w-full">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </Button>
                ) : (
                    <Button className={cn(className)}>
                        + Add Member
                    </Button>
                )}
            </DialogTrigger>



            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Update Member" : "Add Member"}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update the member details and permissions."
                            : "Fill in the details and assign permissions."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="@john" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="john@example.com" {...field} />
                                    </FormControl>
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
                                        <Input type="password" placeholder="*******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permission"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permission</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select permission" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="READ">READ</SelectItem>
                                            <SelectItem value="READ_WRITE">READ / WRITE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type="submit">
                                {initialData ? "Update" : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};




