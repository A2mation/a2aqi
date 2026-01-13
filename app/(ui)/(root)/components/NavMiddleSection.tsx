"use client";
import React, { useEffect, useState, useRef } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavbarMiddleSection({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // This navbar does NOT scroll — the PAGE does
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn("z-50", className)}>
      <Menu setActive={setActive}>
        <Link
          href={"/learn"}
          className={cn(
            "group flex flex-col gap-0.5 cursor-pointer text-lg font-bold  dark:text-white",
            isScrolled ? "text-blue-700" : "text-blue-500"
          )}
        >
          Learn
          <div className={`${isScrolled ? "bg-gray-700" : "bg-blue-500"} h-1 w-0 group-hover:w-full transition-all duration-300`} />
        </Link>

        <Link
          href={"/#blogs"}
          className={cn(
            "group flex flex-col gap-0.5 cursor-pointer text-lg font-bold dark:text-white",
            isScrolled ? "text-blue-700" : "text-blue-500"
          )}
        >
          Blogs
          <div className={`${isScrolled ? "bg-gray-700" : "bg-blue-500"} h-1 w-0 group-hover:w-full transition-all duration-300`} />
        </Link>

        <MenuItem setActive={setActive} active={active} item="Sectors">
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Construction"
              href="#construction"
              src="https://motionarray.imgix.net/2519128-LHNmiJT7pZ-high_0005.jpg?w=660&q=60&fit=max&auto=format"
              description="Air Quality Monitoring for Construction Sites"
            />
            <ProductItem
              title="Hospitals"
              href="/air-quality-monitoring-hospital-sites"
              src="https://elements-resized.envatousercontent.com/elements-video-cover-images/bbd0ce1a-28f3-4c0d-bd14-104264c92b10/video_preview/video_preview_0000.jpg?w=1200&h=630&cf_fit=crop&q=85&format=jpeg&s=5e568852b985ae253c51752c8d3e2c772bf55c5bf96a1b04d930d99cceb5bb9f"
              description="Offer real-time pollution data, allowing hospitals to anticipate high pollution periods."
            />
            <ProductItem
              title="Smart Cities"
              href="#smart-cities"
              src="https://www.shutterstock.com/image-vector/smart-city-graphic-one-blue-260nw-2476922281.jpg"
              description="Empowering Smart Cities with Environmental Monitoring Solutions"
            />
            <ProductItem
              title="Institution"
              href="#institution"
              src="https://static.vecteezy.com/system/resources/thumbnails/022/530/575/small/school-building-exterior-vector-illustration-png.png"
              description="Sensor-Driven Solutions for Safer, Smarter Schools."
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-10 p-4">
            <ProductItem title="SOON" href="#construction" src="https://motionarray.imgix.net/2519128-LHNmiJT7pZ-high_0005.jpg?w=660&q=60&fit=max&auto=format" description="Air Quality Monitoring for Construction Sites" />
            <ProductItem title="SOON" href="#hospitals" src="https://elements-resized.envatousercontent.com/elements-video-cover-images/bbd0ce1a-28f3-4c0d-bd14-104264c92b10/video_preview/video_preview_0000.jpg?w=1200&h=630&cf_fit=crop&q=85&format=jpeg&s=5e568852b985ae253c51752c8d3e2c772bf55c5bf96a1b04d930d99cceb5bb9f" description="Offer real-time pollution data, allowing hospitals to anticipate high pollution periods." />
            <ProductItem title="SOON" href="#smart-cities" src="https://www.shutterstock.com/image-vector/smart-city-graphic-one-blue-260nw-2476922281.jpg" description="Empowering Smart Cities with Environmental Monitoring Solutions" />
            <ProductItem title="SOON" href="#institution" src="https://static.vecteezy.com/system/resources/thumbnails/022/530/575/small/school-building-exterior-vector-illustration-png.png" description="Sensor-Driven Solutions for Safer, Smarter Schools." />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#soon">Contact us</HoveredLink>
            <HoveredLink href="/#soon">Company</HoveredLink>
            <HoveredLink href="/#soon">Manage Data</HoveredLink>
            <HoveredLink href="/#soon">Aqi related query</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
