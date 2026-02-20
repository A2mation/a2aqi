"use client"

import Image from "next/image"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { MetaIcon } from "@/components/icons/MetaIcon"

const formSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Must be at least 8 characters long."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type FormValues = z.infer<typeof formSchema>

export function UserSignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: FormValues) {
        console.log(values)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="p-6 md:p-8"
                        >
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">
                                        Create your account
                                    </h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Enter your details below to create your account
                                    </p>
                                </div>

                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Name</FieldLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </Field>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Email</FieldLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FieldDescription>
                                                We&apos;ll use this to contact you. We will not share your
                                                email with anyone else.
                                            </FieldDescription>
                                            <FormMessage />
                                        </Field>
                                    )}
                                />

                                {/* Password Grid */}
                                <Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Password</FieldLabel>
                                                    <FormControl>
                                                        <Input type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </Field>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <Field>
                                                    <FieldLabel>Confirm Password</FieldLabel>
                                                    <FormControl>
                                                        <Input type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    <FieldDescription>
                                        Must be at least 8 characters long.
                                    </FieldDescription>
                                </Field>

                                <Field>
                                    <Button type="submit" className="cursor-pointer">Create Account</Button>
                                </Field>

                                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                    Or continue with
                                </FieldSeparator>

                                <Field className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" type="button" className="cursor-pointer">
                                        <GoogleIcon />
                                        <span className="sr-only">
                                            Login with Google
                                        </span>
                                    </Button>
                                    <Button variant="outline" type="button" className="cursor-pointer">
                                        <MetaIcon />
                                        <span className="sr-only">
                                            Login with Meta
                                        </span>
                                    </Button>
                                </Field>

                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link href="/user/sign-in">
                                        Sign in
                                    </Link>
                                </FieldDescription>
                            </FieldGroup>
                        </form>
                    </Form>

                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/assets/a2aqi-banner.png"
                            alt="Image"
                            width={400}
                            height={100}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
            </FieldDescription>
        </div>
    )
}