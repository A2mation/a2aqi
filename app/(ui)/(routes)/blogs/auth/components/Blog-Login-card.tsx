"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavbarLogo } from "../../../../../../components/ui/resizable-navbar"
import { cn } from "@/lib/utils"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import Link from "next/link"

import {
    signInSchema,
    signUpSchema,
    SignInValues,
    SignUpValues,
} from "./schemas"

export const BLOGPAGEAUTHTYPE = {
  SIGNUP: "SIGNUP",
  SIGNIN: "SIGNIN",
} as const

export type BlogPageAuthType =
  (typeof BLOGPAGEAUTHTYPE)[keyof typeof BLOGPAGEAUTHTYPE]

interface Props {
    title: string
    desc: string
    type: BlogPageAuthType
}

export function BlogLoginCard({ title, desc, type }: Props) {
    const isSignup = type === BLOGPAGEAUTHTYPE.SIGNUP
    console.log(type)

    const form = useForm<SignInValues | SignUpValues>({
        resolver: zodResolver(isSignup ? signUpSchema : signInSchema),
        defaultValues: isSignup
            ? { name: "", email: "", password: "" }
            : { email: "", password: "" },
    })

    function onSubmit(values: SignInValues | SignUpValues) {
        console.log(values)
        // handle auth here
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{title} to Blogs</CardTitle>
                <CardDescription>{desc}</CardDescription>
                <CardAction>
                    <NavbarLogo />
                </CardAction>
            </CardHeader>

            <CardContent>
                <Form key={type} {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {isSignup && (
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
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
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
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {title}
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <div className="flex items-center justify-center w-full">
                    {isSignup ? "Already have an blog account?" : "Don't have an blog account?"}
                    <Link
                        href={
                            isSignup
                                ? "/blogs/auth/sign-in"
                                : "/blogs/auth/sign-up"
                        }
                        className={cn(buttonVariants({ variant: "link" }))}
                    >
                        {isSignup ? "Sign In" : "Sign Up"}
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
