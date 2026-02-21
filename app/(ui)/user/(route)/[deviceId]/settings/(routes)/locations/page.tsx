"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChartLoader from "@/components/ui/chart-loading"

interface SavedLocationItem {
  id: string
  name: string
  latitude: number
  longitude: number
  createdAt: string
  type: "HOME" | "WORK" | "CUSTOM"
}

const SavedLocation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: locations, isLoading } = useQuery({
    queryKey: ["saved-locations"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1000))

      return [
        {
          id: "1",
          name: "Home",
          latitude: 23.8103,
          longitude: 90.4125,
          createdAt: new Date().toISOString(),
          type: "HOME",
        },
        {
          id: "2",
          name: "Office",
          latitude: 23.7806,
          longitude: 90.4070,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          type: "WORK",
        },
        {
          id: "3",
          name: "Warehouse Site",
          latitude: 23.7500,
          longitude: 90.3900,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          type: "CUSTOM",
        },
      ] as SavedLocationItem[]
    },
  })

  return (
    <section>
      <div className="flex min-h-screen bg-white">
        {/* SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* MAIN CONTENT */}
        <div
          className={cn(
            "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
            isCollapsed ? "lg:ml-16" : "lg:ml-60"
          )}
        >
          <Header
            title="Saved Locations"
            description="Manage your frequently used device locations."
          />

          <div className="mt-20 md:mt-5 space-y-6 px-2 max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <ChartLoader />
              </div>
            ) : locations?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No saved locations yet.
              </div>
            ) : (
              <div className="space-y-4">
                {locations?.map((loc) => (
                  <Card
                    key={loc.id}
                    className="hover:shadow-md transition"
                  >
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      {/* LEFT */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">
                            {loc.name}
                          </h3>

                          <Badge
                            variant={
                              loc.type === "HOME"
                                ? "default"
                                : loc.type === "WORK"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {loc.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Lat: {loc.latitude} | Lng: {loc.longitude}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Saved on{" "}
                          {new Date(loc.createdAt).toLocaleString()}
                        </p>

                        {/* Small Map Preview */}
                        <div className="mt-2 rounded-lg overflow-hidden border h-40 md:h-50">
                          <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}&z=15&output=embed`}
                          />
                        </div>
                      </div>

                      {/* RIGHT ACTIONS */}
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>

                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SavedLocation