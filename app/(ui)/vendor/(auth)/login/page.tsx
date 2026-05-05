"use client"

import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NavbarLogo } from '@/components/ui/resizable-navbar'
import { vendorLoginSchema } from '@/lib/validation/vendor/Vendor.login.schema'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"


const VendorLoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm < z.infer < typeof vendorLoginSchema >> ({
    resolver: zodResolver(vendorLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof vendorLoginSchema>) {
    const toastId = toast.loading(
      "Signing in..."
    );
    try {
      setLoading(true);
      form.reset();

      const res = await signIn("vendor", {
        ...values,
        redirect: false
      })
      if (res?.error) {
        toast.error(res.error, { id: toastId });
        return;
      }

      toast.success(`Welcome back users 👋`, { id: toastId });
      router.push("/vendor/users");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  } as const

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-none bg-white overflow-hidden">
          <CardHeader className="space-y-2 flex justify-center items-center flex-col pb-8">
            <motion.div variants={itemVariants}>
              <NavbarLogo />
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                Vendor Login
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back! Please enter your credentials.
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-700">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@company.com"
                            {...field}
                            className="bg-slate-50 h-11 focus-visible:ring-blue-500 transition-all border-slate-200"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="font-semibold text-slate-700">Password</FormLabel>
                          <Button variant="link" className="px-0 font-normal text-xs text-blue-600 h-auto hover:text-blue-700 transition-colors" disabled={loading}>
                            Forgot password?
                          </Button>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="bg-slate-50 h-11 focus-visible:ring-blue-500 transition-all border-slate-200"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 mt-2 transition-all shadow-md active:scale-[0.98] focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>

          <motion.div variants={itemVariants}>
            <CardFooter className="flex flex-col border-t pt-6 bg-slate-50/50 rounded-b-xl">
              <p className="text-sm text-slate-600 text-center">
                Don&apos;t have a vendor account?{" "}
                <Link
                  href="/vendor/register"
                  className="text-blue-600 font-semibold hover:underline underline-offset-4 decoration-2"
                >
                  Register your business
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default VendorLoginPage