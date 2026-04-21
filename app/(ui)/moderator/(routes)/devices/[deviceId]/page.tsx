"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { http } from "@/lib/http";
import Header from "./components/Header";
import CustomDays from "./components/CustomDays";
import AdvancedDeviceChart from "./components/AdvancedDeviceChart";
import { AnalyticsResponse } from "@/types/monitors/monitor.analytics.type";
import { Skeleton } from "@/components/ui/skeleton";
import NoDataFound from "@/components/Error/No-data-Found";

const MonitorDeviceAnalyticsPage: React.FC = () => {
  const { deviceId } = useParams();
  const [mounted, setMounted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading, isError } = useQuery<AnalyticsResponse>({
    queryKey: ["deviceDetails-moderator", deviceId, today],
    queryFn: async () => {
      const response = await http.get(`/api/moderators/devices/${deviceId}`, {
        params: { startDate: today },
      });

      console.log(response);
      if (response.data.error || response.status !== 200) {
        toast.error(response.data.error || "Something went wrong");
        throw new Error(response.data.message);
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 40000,
    refetchInterval: 40000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isError) {
    return <NoDataFound />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFE] p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          data && (
            <>
              <Header device={data.device} />

              <div className="grid grid-cols-1 gap-8 mt-8">
                {/* Main Line Chart */}
                <AdvancedDeviceChart
                  hourlyData={data.hourly}
                  liveData={data.latestReading}
                />
              </div>

              <CustomDays
                last30days={data.last30Days}
                deviceId={deviceId as string}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-10 min-h-screen animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end pb-6 border-b border-black/5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-black/5" />
          <Skeleton className="h-12 w-64 bg-black/10" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full bg-black/5" />
          <Skeleton className="h-10 w-10 rounded-full bg-black/5" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40 bg-black/5" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full bg-black/5" />
              <Skeleton className="h-8 w-16 rounded-full bg-black/5" />
            </div>
          </div>
          <Skeleton className="h-100 w-full rounded-3xl bg-black/3" />
        </div>

        {/* Sidebar Stats Area */}
        <div className="space-y-6">
          <Skeleton className="h-45 w-full rounded-3xl bg-black/3" />
          <Skeleton className="h-45 w-full rounded-3xl bg-black/3" />
          <Skeleton className="h-45 w-full rounded-3xl bg-black/3" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pt-10">
        <Skeleton className="h-8 w-48 mb-6 bg-black/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-black/2" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitorDeviceAnalyticsPage;
