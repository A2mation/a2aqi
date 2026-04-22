"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorSectionProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorSection({
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again or contact support if the issue persists.",
  onRetry,
}: ErrorSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] px-4 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-red-500 mb-2">{title}</h2>
      <p className="text-zinc-400 max-w-md mb-8">{message}</p>
      <div className="flex gap-4">
        <Button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 cursor-pointer"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
