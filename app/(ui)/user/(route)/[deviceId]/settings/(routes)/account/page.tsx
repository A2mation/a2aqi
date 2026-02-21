"use client"

import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import { useState } from "react"

const ProfileViewPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await http.get("/api/user")
      return data
    },
  })

  return (
    <section>
      <div className="flex min-h-screen bg-background">
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
            title="Profile Details"
            description="View your account information."
          />

          <div className="mt-6 max-w-3xl">
            <Card className="p-6">
              <CardContent className="space-y-6 p-0">

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <Skeleton className="w-20 h-20 rounded-full" />
                  ) : (
                    <Avatar className="w-20 h-20">
                      <AvatarFallback>
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">
                          {user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <DetailItem
                    label="Recovery Email"
                    value={user?.recoveryEmail}
                    isLoading={isLoading}
                  />

                  <DetailItem
                    label="Phone Number"
                    value={user?.phoneNumber}
                    isLoading={isLoading}
                  />

                  <DetailItem
                    label="Account Type"
                    value={user?.accountType}
                    isLoading={isLoading}
                  />

                  {user?.accountType === "ORGANIZATION" && (
                    <DetailItem
                      label="Organization Name"
                      value={user?.organizationName}
                      isLoading={isLoading}
                    />
                  )}

                  <DetailItem
                    label="Member Since"
                    value={
                      user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : ""
                    }
                    isLoading={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileViewPage

/* ===============================
   Reusable Detail Component
=============================== */

const DetailItem = ({
  label,
  value,
  isLoading,
}: {
  label: string
  value?: string | null
  isLoading: boolean
}) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    {isLoading ? (
      <Skeleton className="h-4 w-32" />
    ) : (
      <p className="text-sm font-medium">
        {value || "Not provided"}
      </p>
    )}
  </div>
)