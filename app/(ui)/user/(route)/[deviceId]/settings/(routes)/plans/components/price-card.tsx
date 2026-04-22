"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CheckOutButton = dynamic(() => import("@/components/CheckOut-Button"), {
  ssr: false,
});

const selectionManager = {
  activeId: null as string | null,
  subscribers: new Set<() => void>(),
};

interface PricingCardProps {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  buttonText: string;
  current?: boolean;
}

export function PricingCard({
  id,
  name,
  price,
  period,
  description,
  features,
  featured,
  buttonText,
  current,
}: PricingCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const handler = () => setIsSelected(selectionManager.activeId === name);
    selectionManager.subscribers.add(handler);
    handler();
    return () => {
      selectionManager.subscribers.delete(handler);
    };
  }, [name]);

  const handleSelect = () => {
    if (current) return;
    selectionManager.activeId = name;
    selectionManager.subscribers.forEach((notify) => notify());
  };

  return (
    <Card
      onClick={handleSelect}
      className={cn(
        "relative flex flex-col border-2 cursor-pointer transition-all duration-300",
        isSelected
          ? "border-blue-600 shadow-xl shadow-blue-50"
          : "border-slate-200 hover:border-slate-300",
        featured && !isSelected && "border-slate-200",
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest z-10">
          Most Popular
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg font-bold">{name}</CardTitle>
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight">₹{price}</span>
            <span className="text-sm font-medium text-slate-500">
              /{period}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            * For this device only
          </span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-sm text-slate-600 font-medium"
            >
              <div
                className={cn(
                  "p-0.5 rounded-full",
                  isSelected ? "bg-blue-100" : "bg-emerald-100",
                )}
              >
                <Check
                  className={cn(
                    "w-3 h-3",
                    isSelected ? "text-blue-600" : "text-emerald-600",
                  )}
                />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {current ? (
          <Button variant="outline" className="w-full font-bold" disabled>
            Current Plan
          </Button>
        ) : isSelected ? (
          <CheckOutButton amount={price} pricingPlanId={id} />
        ) : (
          <Button
            variant="secondary"
            className="w-full font-bold"
            onClick={handleSelect}
          >
            {buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
