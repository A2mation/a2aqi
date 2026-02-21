"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import ChartLoader from "@/components/ui/chart-loading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Alert {
  id: string
  title: string
  message: string
  type: "INFO" | "WARNING" | "CRITICAL"
  createdAt: string
}

const AlertsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)



  const { data: alerts, isLoading } = useQuery({
    queryKey: ["user-alerts"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1000)) // simulate loading

      return [
        {
          id: "1",
          title: "High AQI Detected",
          message:
            "Air Quality Index exceeded safe levels (AQI: 185). Consider reducing outdoor activity.",
          type: "CRITICAL",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Moderate AQI Level",
          message:
            "Air Quality Index is moderate (AQI: 95). Sensitive groups should take precautions.",
          type: "WARNING",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "3",
          title: "Device Offline",
          message:
            "Living Room Sensor has gone offline. Last active 15 minutes ago.",
          type: "WARNING",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "4",
          title: "Temperature Threshold Reached",
          message:
            "Room temperature exceeded 35°C. Cooling system recommended.",
          type: "INFO",
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: "5",
          title: "Gas Leak Detected",
          message:
            "Dangerous gas concentration detected. Immediate ventilation required.",
          type: "CRITICAL",
          createdAt: new Date(Date.now() - 20000000).toISOString(),
        },
        {
          id: "6",
          title: "Sensor Calibration Needed",
          message:
            "Outdoor AQI sensor requires recalibration for accurate readings.",
          type: "INFO",
          createdAt: new Date(Date.now() - 30000000).toISOString(),
        },
      ]
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
            title="Alerts"
            description="Monitor important notifications and system alerts."
          />
          <div className="mt-20 md:mt-5 space-y-6 px-2 max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <ChartLoader />
              </div>
            ) : alerts?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No alerts available.
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.map((alert) => (
                  <Card
                    key={alert.id}
                    className="hover:shadow-md transition"
                  >
                    <CardContent className="p-4 flex justify-between items-start gap-4">

                      {/* LEFT SIDE */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">
                            {alert.title}
                          </h3>

                          <Badge
                            variant={
                              alert.type === "CRITICAL"
                                ? "destructive"
                                : alert.type === "WARNING"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {alert.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
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

export default AlertsPage