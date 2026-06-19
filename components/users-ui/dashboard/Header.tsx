"use client";

import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Cpu,
  Layers,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";
import { useDeviceStore } from "@/store/use-device.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const router = useRouter();
  const session = useSession();
  const { deviceId } = useParams();
  const { devices, selectedDeviceId, selectedDeviceActiveStatus } = useDeviceStore();


  // Find the metadata details for the active device
  const currentDevice = devices.find(
    (d) => d.id === (deviceId || selectedDeviceId)
  );

  const handleDeviceChange = (val: string) => {
    router.push(`/user/${val}/dashboard`);
  };

  return (
    <>
      <header className="space-y-4 px-4 py-3 sticky top-0 z-40 ">

        <div className="bg-background/60 backdrop-blur-md border-b border-border/40 py-2 -mx-4 px-4 transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section: Nav & Selected Item Specs */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MobileNav />

              {currentDevice && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/80 rounded-full border border-border/60 max-w-sm animate-in fade-in duration-300">
                  <Cpu className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex items-center gap-1.5 text-xs md:text-xl truncate">
                    <span className="font-semibold text-foreground truncate">
                      {currentDevice.name}
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="text-muted-foreground font-mono tracking-tight shrink-0">
                      {currentDevice.serialNo || "No Serial"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {selectedDeviceActiveStatus ? (
                /* Online State Badge */
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 max-w-max animate-in fade-in duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                </div>
              ) : (
                /* Offline State Badge */
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full border border-destructive/20 max-w-max animate-in fade-in duration-300">
                  <div className="h-2 w-2 bg-destructive rounded-full opacity-60" />
                  <span className="text-xs font-semibold tracking-wide uppercase text-destructive">
                    Offline
                  </span>
                </div>
              )}
            </div>


            <div className="flex items-center gap-3">
              {devices && devices.length > 0 && (
                <div className="w-45 sm:w-55">
                  <Select
                    value={(deviceId as string) || selectedDeviceId || undefined}
                    onValueChange={handleDeviceChange}
                  >
                    <SelectTrigger className="h-20 rounded-xl bg-card border-border/60 hover:bg-secondary/50 focus:ring-ring/30 transition-all text-sm md:text-base font-medium">
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="h-5 w-5 text-primary shrink-0" />
                        <SelectValue placeholder="Select Monitoring Unit" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-xl border-border/80">
                      {devices.map((device) => (
                        <SelectItem
                          key={device.id}
                          value={device.id}
                          className="text-sm md:text-base font-medium rounded-lg cursor-pointer py-2 focus:bg-primary focus:text-primary-foreground"
                        >
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center pl-2 border-l border-border/60">
                {session.data && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 cursor-pointer focus:outline-none rounded-full transition-all group">
                        <Avatar className="w-9 h-9 border border-border/80 group-hover:border-primary/40 transition-all shadow-sm">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground font-bold tracking-wider">
                            {session.data.user.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-60 mt-2 shadow-xl border-border/80 rounded-xl p-1.5"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1 px-2 py-1.5">
                          <p className="text-sm font-bold leading-none text-foreground">
                            {session.data.user.name}
                          </p>
                          <p className="text-sm leading-none text-muted-foreground truncate">
                            {session.data.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="bg-border/60" />

                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2 text-xs font-medium focus:bg-secondary focus:text-accent-foreground">
                          <Link href={`/user/${deviceId}/settings/account`} className="flex items-center w-full">
                            <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">View Profile</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2 text-xs font-medium focus:bg-secondary focus:text-accent-foreground">
                          <Link href={`/user/${deviceId}/settings/profile`} className="flex items-center w-full">
                            <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Account Settings</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2 text-xs font-medium focus:bg-secondary focus:text-accent-foreground">
                          <Link href={`/user/${deviceId}/settings/plans`} className="flex items-center w-full">
                            <CreditCard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Billing & Plans</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="bg-border/60" />

                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg py-2 text-xs font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2.5 h-4 w-4" />
                        <span className="text-sm">Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>

      </header>

      <div className="px-6 py-3 -mx-3">
        <div className="pt-2">
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-0.5">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-1 animate-in slide-in-from-top-2 duration-200">
            {actions}
          </div>
        )}
      </div>
    </>

  );
}