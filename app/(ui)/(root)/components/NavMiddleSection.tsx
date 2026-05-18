"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { IconBuildingBank, IconBuildingFactory2, IconBuildingHospital, IconBuildings } from "@tabler/icons-react";


export function NavbarMiddleSection({
  className,
  onClickAction
}: {
  className?: string;
  onClickAction?: () => void;
}) {
  const router = useRouter();
  const [active, setActive] = useState < string | null > (null);
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
          onClick={onClickAction}
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
          onClick={onClickAction}
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
          onClick={onClickAction}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "group flex flex-col items-start italic gap-0.5 cursor-pointer text-lg md:text-xl font-bold  dark:text-white border-0",
                isScrolled ? "text-black" : "text-black"
              )}>
              Sectors
              <div
                className={cn(
                  "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
                  "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
                )}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-50" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                Sectors
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/air-quality-monitoring-construction-sites')}>
                Construction
                <DropdownMenuShortcut><IconBuildingFactory2 stroke={2} /></DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/air-quality-monitoring-hospital-sites')}>
                Hospitals
                <DropdownMenuShortcut><IconBuildingHospital stroke={2} /></DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/air-quality-monitoring-smart-cities')}>
                Smart Cities
                <DropdownMenuShortcut><IconBuildings stroke={2} /></DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/air-quality-monitoring-industries')}>
                Institution
                <DropdownMenuShortcut><IconBuildingBank stroke={2} /></DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>

        </DropdownMenu>

        <Link
          href={"/about-us"}
          className={cn(
            "group flex flex-col italic gap-0.5 cursor-pointer text-lg md:text-xl font-bold  dark:text-white",
            isScrolled ? "text-black" : "text-black"
          )}
          onClick={onClickAction}
        >
          <div className="flex flex-row gap-1">
            <span>
              About
            </span>
            <span>
              Us
            </span>
          </div>
          <div
            className={cn(
              "h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out",
              "bg-linear-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-[0_1px_8px_rgba(59,130,246,0.4)]"
            )}
          />
        </Link>

      </Menu>
    </div>
  );
}
