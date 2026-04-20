"use client";

import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GitGraph } from "lucide-react";
import Link from "next/link";

import { MonitorAnalyticsDevice } from "@/types/monitors/monitor.analytics.type";

const Header = ({ device }: { device: MonitorAnalyticsDevice }) => {
  const router = useRouter();
  const { deviceId } = useParams();
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => router.back()}
            initial={{ x: 0 }}
            whileHover={{
              scale: 1.1,
              x: -4,
              backgroundColor: "#f3f4f6",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="p-2 bg-gray-200 cursor-pointer rounded-full transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">
                {device.name ? device.name : device.serialNo}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Serial: {device.serialNo}• Model: {device.model.name}
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href={`/moderator/devices/${deviceId}/calibration`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            <GitGraph size={16} /> Calibrate
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
