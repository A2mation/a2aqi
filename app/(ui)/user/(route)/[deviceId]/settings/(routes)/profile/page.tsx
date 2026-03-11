"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AddressType } from "@prisma/client"

import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import { Separator } from "@/components/ui/separator"
import { AddressForm } from "./components/Address-Form"
import ChartLoader from "@/components/ui/chart-loading"
import { Header } from "@/components/users-ui/dashboard/Header"
import { UserDetailsForm } from "./components/User-details-Form"
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"

export interface AddressFormValues {
  pincode: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
}

const ProfilePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await http.get("/api/user")
      return data
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

          <div className="mt-20 md:mt-5 space-y-10 px-2 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-right-1">

            {
              isLoading || !user ?
                <div className="flex items-center justify-center h-screen">
                  <ChartLoader />
                </div>
                : (
                  <UserDetailsForm user={user} />
                )
            }

            <Separator />

            {/* Address section */}
            <AddressForm user={user} isLoading={isLoading} />

          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage