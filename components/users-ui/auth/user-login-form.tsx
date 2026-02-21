"use client"

import Image from "next/image"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

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
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof formSchema>

export function UserLoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: FormValues) {
        try {
            setLoading(true)

            const res = await signIn("user", {
                email: values.email,
                password: values.password,
                redirect: false,
            })
            console.log(res)

            if (res?.error) {
                toast.error(res.error)
                return
            }

            toast.success("Login successful 🎉")
            router.push("/user")

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
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
                                        Welcome back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>

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
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </Field>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <Field>
                                            <div className="flex items-center">
                                                <FieldLabel>Password</FieldLabel>
                                                <a
                                                    href="#"
                                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>

                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </Field>
                                    )}
                                />

                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="cursor-pointer w-full flex items-center justify-center gap-2"
                                    >
                                        {loading && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                        Login
                                    </Button>
                                </Field>

                                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                    Or continue with
                                </FieldSeparator>

                                {/* Google */}
                                <Field className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        disabled={loading}
                                        className="cursor-pointer"
                                        onClick={async () => {
                                            setLoading(true)
                                            await signIn("google", { callbackUrl: "/user" })
                                        }}
                                    >
                                        <GoogleIcon />
                                        <span className="sr-only">
                                            Login with Google
                                        </span>
                                    </Button>

                                    {/* Meta disabled unless configured */}
                                    <Button
                                        variant="outline"
                                        type="button"
                                        disabled
                                        className="cursor-pointer"
                                    >
                                        <MetaIcon />
                                        <span className="sr-only">
                                            Login with Meta
                                        </span>
                                    </Button>
                                </Field>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/user/sign-up">
                                        Sign up
                                    </Link>
                                </FieldDescription>

                            </FieldGroup>
                        </form>
                    </Form>

                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/assets/a2aqi-banner.png"
                            alt="Image"
                            width={600}
                            height={100}
                            className="absolute inset-0 h-fit w-full object-cover dark:brightness-[0.2] dark:grayscale"
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