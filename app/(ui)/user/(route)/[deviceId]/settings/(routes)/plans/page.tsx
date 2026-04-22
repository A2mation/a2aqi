"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { PricePlanProps } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceModal } from "@/hooks/use-device-store";
import { Sidebar } from "@/components/users-ui/dashboard/Sidebar";
import { Header } from "@/components/users-ui/dashboard/Header";
import { DeviceModal } from "@/components/modals/device-modal";

import { ErrorSection } from "./Error/sub-error";
import { PricingCard } from "./components/price-card";

export default function PricingPage() {
  const { deviceId } = useParams();
  const deviceModal = useDeviceModal();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PricePlanProps[]>({
    queryKey: ["device-plan-list", deviceId],
    queryFn: async () => {
      const res = await http.get("/api/user/device/plans", {
        params: {
          deviceId,
        },
      });

      if (res.status !== 200 && res.data.error) {
        throw new Error(res.data.message || "Something Went Wrong");
      }
      return res.data;
    },
    enabled: !!deviceId,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex min-h-screen bg-background">
      <DeviceModal />
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <main
        className={cn(
          "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
          isCollapsed ? "lg:ml-16" : "lg:ml-60",
        )}
      >
        <Header
          title="Choose Your Device Plan"
          description="Select a yearly subscription based on how many devices you need to
            monitor."
          actions={
            <Button
              className="w-full cursor-pointer sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
              onClick={deviceModal.onOpen}
            >
              + Add Device
            </Button>
          }
        />

        {isError && <ErrorSection onRetry={refetch} />}
        <div className="mt-6">
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-8 rounded-2xl border border-zinc-200 bg-white space-y-6"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-32" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-12 w-full mt-4" />
                  </div>
                ))}
              </>
            )}

            {plans.map((plan) => (
              <PricingCard
                description={
                  "Best for getting started with home monitoring."
                }
                buttonText={"Select Plan"}
                key={plan.id}
                {...plan}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
