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

          <DropdownMenuContent
            className="w-64 p-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] animate-in fade-in-50 zoom-in-95 duration-200"
            align="start"
            sideOffset={8}
          >
            <div className="px-3 py-2 mb-1">
              <p className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                Sectors
              </p>
            </div>

            <DropdownMenuGroup className="space-y-1">
              {[
                {
                  label: "Construction",
                  path: "/air-quality-monitoring-construction-sites",
                  icon: <IconBuildingFactory2 stroke={2} className="size-6" />
                },
                {
                  label: "Hospitals",
                  path: "/air-quality-monitoring-hospital-sites",
                  icon: <IconBuildingHospital stroke={2} className="size-6" />
                },
                {
                  label: "Smart Cities",
                  path: "/air-quality-monitoring-smart-cities",
                  icon: <IconBuildings stroke={2} className="size-6" />
                },
                {
                  label: "Institution",
                  path: "/air-quality-monitoring-industries",
                  icon: <IconBuildingBank stroke={2} className="size-6" />
                },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 cursor-pointer outline-none focus:bg-amber-50 focus:text-amber-600 dark:focus:bg-amber-950/30 dark:focus:text-amber-400 group data-[disabled]:opacity-50"
                  onClick={() => router.push(item.path)}
                >
                  <span className="tracking-wide transition-transform duration-200 group-focus:translate-x-0.5">
                    {item.label}
                  </span>

                  <DropdownMenuShortcut className="ml-auto text-slate-400 group-focus:text-amber-500 transition-colors duration-200 opacity-80 group-focus:opacity-100 fallback-shortcut">
                    {item.icon}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
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
