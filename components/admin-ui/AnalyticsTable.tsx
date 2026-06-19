"use client";

import {
  Eye,
  ShoppingBag,
  TrendingUp,
  CalendarClock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricItem {
  id: string;
  totalViews: number;
  dailyViews: number;
  lastReset: string;
}

interface AnalyticsData {
  buyNow: MetricItem[];
  viewDetails: MetricItem[];
}

interface AnalyticsTableProps {
  data?: AnalyticsData;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;
}

export default function AnalyticsTable({ data, isLoading, isPending, error }: AnalyticsTableProps) {
  const [activeTab, setActiveTab] = useState < "buyNow" | "viewDetails" > ("buyNow");

  if (isLoading || isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 rounded-2xl border border-neutral-200 bg-linear-to-b from-white to-neutral-50 p-8 text-center space-y-4 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-neutral-500 font-medium tracking-wide animate-pulse">
          Fetching real-time analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 rounded-2xl border border-rose-200 bg-linear-to-b from-white to-rose-50/30 p-8 text-center space-y-3 shadow-sm">
        <div className="p-3 bg-rose-50 rounded-full text-rose-600 border border-rose-100">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-md font-semibold text-neutral-800">Failed to load metrics</h3>
        <p className="text-sm text-neutral-500 max-w-xs">{error.message || "An unexpected network error occurred."}</p>
      </div>
    );
  }

  const currentData = data?.[activeTab] || [];

  const cleanId = (fullId: string) => fullId.split(":")[1] || fullId;

  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);

    const dateStr = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const timeStr = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { dateStr, timeStr };
  };

  return (
    <div className="w-full rounded-2xl border mt-10 border-neutral-200/80 bg-linear-to-b from-white to-neutral-50/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">

      {/* Header & Tabs Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Conversion Analytics
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">Monitor real-time intent and user engagement metrics.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "buyNow" | "viewDetails")} className="w-full sm:w-auto">
          <TabsList className="bg-neutral-100/80 border border-neutral-200/60 h-10 p-1 rounded-xl w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger
              value="buyNow"
              className="rounded-lg text-sm font-semibold px-4 text-neutral-500 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-2" />
              Buy Now ({data?.buyNow?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="viewDetails"
              className="rounded-lg text-sm font-semibold px-4 text-neutral-500 data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Eye className="h-3.5 w-3.5 mr-2" />
              View Details ({data?.viewDetails?.length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-2">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-100 hover:bg-transparent">
              <TableHead className="text-base font-medium uppercase tracking-wider text-neutral-400 h-12">Product ID</TableHead>
              <TableHead className="text-base font-medium uppercase tracking-wider text-neutral-400 text-center h-12">Daily Views</TableHead>
              <TableHead className="text-base font-medium uppercase tracking-wider text-neutral-400 text-center h-12">Total Views</TableHead>
              <TableHead className="text-base font-medium uppercase tracking-wider text-neutral-400 text-right h-12">Last Updated</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="popLayout">
              {currentData.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-32 text-center text-sm text-neutral-400">
                    No interactions logged today.
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item, index) => {
                  const { dateStr, timeStr } = formatDateTime(item.lastReset);
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="group border-b border-neutral-100 hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* ID Column */}
                      <TableCell className="font-mono text-sm py-4 max-w-50 truncate">
                        <span className="inline-block bg-neutral-100 text-neutral-600 rounded-md px-2 py-0.5 border border-neutral-200/60 text-sm font-medium group-hover:bg-neutral-200/50 transition-colors">
                          {cleanId(item.id)}
                        </span>
                      </TableCell>

                      {/* Daily Counter */}
                      <TableCell className="text-center py-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-bold font-mono tracking-tight border
                          ${activeTab === 'buyNow'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-sky-50 text-sky-700 border-sky-100'
                          }`}
                        >
                          {item.dailyViews}
                        </span>
                      </TableCell>

                      {/* Total Counter */}
                      <TableCell className="text-center py-4 font-mono text-sm text-neutral-600 group-hover:text-neutral-900 font-semibold transition-colors">
                        {item.totalViews}
                      </TableCell>

                      {/* Timestamp (Date + Time) */}
                      <TableCell className="text-right py-4 text-sm font-mono">
                        <span className="inline-flex items-center gap-2 bg-neutral-50/50 border border-neutral-100 px-2.5 py-1 rounded-lg text-neutral-500 group-hover:border-neutral-200 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          <CalendarClock className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-500" />
                          <span>
                            <span className="text-neutral-700 font-medium">{dateStr}</span>
                            <span className="mx-1 text-neutral-300">•</span>
                            <span className="text-neutral-400 font-normal">{timeStr}</span>
                          </span>
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}