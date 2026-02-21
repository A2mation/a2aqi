"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"

import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import toast from "react-hot-toast"
import ChartLoader from "@/components/ui/chart-loading"

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  recoveryEmail: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  accountType: z.enum(["PERSONAL", "ORGANIZATION"]),
  organizationName: z.string().optional(),
}).refine(
  (data) =>
    data.accountType === "PERSONAL" ||
    (data.accountType === "ORGANIZATION" && data.organizationName),
  {
    message: "Organization name is required",
    path: ["organizationName"],
  }
)

type ProfileFormValues = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const queryClient = useQueryClient()

  /* ===============================
     FETCH USER
  =============================== */

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await http.get("/api/user")
      return data
    },
  })

  /* ===============================
     FORM SETUP
  =============================== */

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      recoveryEmail: "",
      phoneNumber: "",
      accountType: "PERSONAL",
      organizationName: "",
    },
  })

  /* ===============================
     POPULATE FORM
  =============================== */

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        recoveryEmail: user.recoveryEmail || "",
        phoneNumber: user.phoneNumber || "",
        accountType: user.accountType || "PERSONAL",
        organizationName: user.organizationName || "",
      })
    }
  }, [user, form])

  /* ===============================
     UPDATE MUTATION
  =============================== */

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data } = await http.patch("/api/user", values)
      return data
    },
    onSuccess: () => {
      toast.success("Profile updated successfully")
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })

  return (
    <section >
      <div className="flex min-h-screen bg-white">
        <div className="hidden lg:block">
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        <div
          className={cn(
            "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
            isCollapsed ? "lg:ml-16" : "lg:ml-60"
          )}
        >
          <Header
            title="Profile Settings"
            description="Update your profile information."
          />

          <div className="mt-20 md:mt-5 space-y-6 px-2 max-w-7xl mx-auto">

            {
              isLoading ?
                <div className="flex items-center justify-center h-screen">
                  <ChartLoader />
                </div>
                : (
                  <>
                    <Avatar className="w-20 h-20">
                      <AvatarFallback>
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((values) =>
                          updateMutation.mutate(values)
                        )}
                        className="space-y-6"
                      >
                        {/* Name */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email (readonly) */}
                        <div className="space-y-2">
                          <FormLabel>Email</FormLabel>
                          <Input value={user.email} disabled />
                        </div>

                        {/* Recovery Email */}
                        <FormField
                          control={form.control}
                          name="recoveryEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recovery Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Account Type */}
                        <FormField
                          control={form.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PERSONAL">
                                    Personal
                                  </SelectItem>
                                  <SelectItem value="ORGANIZATION">
                                    Organization
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Organization Name */}
                        {form.watch("accountType") === "ORGANIZATION" && (
                          <FormField
                            control={form.control}
                            name="organizationName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <Button
                          type="submit"
                          disabled={updateMutation.isPending}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </>
                )
            }

          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage