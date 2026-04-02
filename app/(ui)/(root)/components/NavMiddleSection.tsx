"use client";
import { useEffect, useState } from "react";

import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavbarMiddleSection({
  className,
  onClick
}: {
  className?: string;
  onClick?: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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
            "group flex flex-col italic gap-0.5 cursor-pointer text-lg md:text-xl font-bold  dark:text-white",
            isScrolled ? "text-black" : "text-black"
          )}
          onClick={onClick}
        >
          Learn
          <div
            className={cn(
              "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
              "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
            )}
          />
        </Link>

        <Link
          href={"/blogs"}
          className={cn(
            "group flex flex-col italic gap-0.5 cursor-pointer text-lg md:text-xl font-bold dark:text-white",
            isScrolled ? "text-black" : "text-black"
          )}
          onClick={onClick}
        >
          Blogs
          <div
            className={cn(
              "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
              "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
            )}
          />
        </Link>



        <Link
          href="/products"
          className={cn(
            "group relative flex flex-col italic gap-0.5 cursor-pointer text-lg md:text-xl font-black transition-all duration-300",
            isScrolled ? "text-slate-900" : "text-white"
          )}
          onClick={onClick}
        >
          {/* The Animated Aurora Text */}
          <span className="relative z-10 transition-all duration-500 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-emerald-400 animate-aurora-text">
            Products
          </span>

          {/* Premium Underline */}
          <div
            className={cn(
              "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
              "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
            )}
          />
        </Link>


        <MenuItem setActive={setActive} active={active} item="Sectors">
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
            <ProductItem
              title="Construction"
              href="/air-quality-monitoring-construction-sites"
              src="https://motionarray.imgix.net/2519128-LHNmiJT7pZ-high_0005.jpg?w=660&q=60&fit=max&auto=format"
              onclick={onClick}
            />
            <ProductItem
              title="Hospitals"
              href="/air-quality-monitoring-hospital-sites"
              src="https://elements-resized.envatousercontent.com/elements-video-cover-images/bbd0ce1a-28f3-4c0d-bd14-104264c92b10/video_preview/video_preview_0000.jpg?w=1200&h=630&cf_fit=crop&q=85&format=jpeg&s=5e568852b985ae253c51752c8d3e2c772bf55c5bf96a1b04d930d99cceb5bb9f"
              onclick={onClick}
            />
            <ProductItem
              title="Smart Cities"
              href="/air-quality-monitoring-smart-cities"
              src="https://www.shutterstock.com/image-vector/smart-city-graphic-one-blue-260nw-2476922281.jpg"
              onclick={onClick}
            />
            <ProductItem
              title="Institution"
              href="/air-quality-monitoring-industries"
              src="https://static.vecteezy.com/system/resources/thumbnails/022/530/575/small/school-building-exterior-vector-illustration-png.png"
              onclick={onClick}
            />
          </div>
        </MenuItem>


        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink onClick={onClick} href="/company">Company</HoveredLink>
            <HoveredLink onClick={onClick} href="/contact-us">Contact us</HoveredLink>
            <HoveredLink onClick={onClick} href="/about-us">About us</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
