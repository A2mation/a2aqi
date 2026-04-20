import { motion } from "motion/react";

const NoDataFound = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 mt-10 backdrop-blur-xl rounded-[3rem] p-10 border border-red-100 shadow-[0_20px_50px_rgba(239,68,68,0.05)] w-full h-150 flex flex-col items-center justify-center text-center"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-200 blur-2xl opacity-20 rounded-full" />
          <div className="relative bg-red-50 p-6 rounded-full border border-red-100">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-2">
          NO <span className="text-red-500">DATA FOUND</span>
        </h3>
        <p className="text-gray-400 font-medium max-w-xs mb-8">
          No data has been received from the device yet.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
        >
          <span className="relative z-10 flex items-center gap-2">
            Retry Connection
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
        </button>
      </motion.div>
    </>
  );
};

export default NoDataFound;
