"use client";

import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";

async function fetchViews() {
    const res = await http.get("/api/visit");
    if (res.status !== 200) {
        throw new Error("Network response was not ok");
    }
    return res.data;
}

export default function ViewStats() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["viewStats"],
        queryFn: fetchViews,
        refetchInterval: 60000 * 2, // 2 Min
        staleTime: 60000 * 2
    });

    if (isLoading) {
        return <div className="h-10 w-48 animate-pulse bg-slate-800/50 rounded-md" />;
    }

    if (isError) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 rounded-md px-0 py-4 text-sm text-slate-400">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>
                {data.total.toLocaleString()} total views,{" "}
                <span className="text-slate-400">
                    {data.today} views today
                </span>
            </span>
        </div>
    );
}