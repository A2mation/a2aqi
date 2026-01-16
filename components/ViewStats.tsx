import { http } from "@/lib/http";
import { BarChart3 } from "lucide-react";

async function getViews() {
    const res = await http.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/visit`);
    return res.data;
}

export default async function ViewStats() {
    const { total, today } = await getViews();

    return (
        <div className="flex items-center gap-2 rounded-md px-0 py-4 text-sm text-slate-400">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>
                {total.toLocaleString()} total views,{" "}
                <span className="text-slate-400">
                    {today} views today
                </span>
            </span>
        </div>
    );
}
