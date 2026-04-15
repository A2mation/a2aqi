"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MainNav = ({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const pathName = usePathname();
    const params = useParams();
    const [open, setOpen] = useState(false);

    const routes = [
        { href: `/admin`, label: 'Overview', active: pathName === `/admin` },
        {
            href: `/admin/device-model`,
            label: 'Models',
            active: pathName.startsWith(`/admin/device-model`)
        },
        {
            href: `/admin/pricing-plan`,
            label: 'Plans',
            active: pathName.startsWith(`/admin/pricing-plan`)
        },
        {
            href: `/admin/coupons`,
            label: 'Coupons',
            active: pathName.startsWith(`/admin/coupons`)
        },
        {
            href: `/admin/device`,
            label: 'Devices',
            active: pathName.startsWith(`/admin/device`) && !pathName.startsWith(`/admin/device-model`)
        },
        {
            href: `/admin/aqi`,
            label: 'AQI',
            active: pathName.startsWith(`/admin/aqi`)
        },
        {
            href: `/admin/blogs`,
            label: 'Blogs',
            active: pathName.startsWith(`/admin/blogs`)
        },
        {
            href: `/admin/writer`,
            label: 'Writer',
            active: pathName.startsWith(`/admin/writer`)
        },
        {
            href: `/admin/monitor`,
            label: 'Monitor',
            active: pathName.startsWith(`/admin/monitor`)
        },
        {
            href: `/admin/moderators`,
            label: 'Moderators',
            active: pathName.startsWith(`/admin/moderators`)
        },
        {
            href: `/admin/settings`,
            label: 'Settings',
            active: pathName.startsWith(`/admin/settings`)
        }
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <nav className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)}>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-base font-medium transition-colors hover:text-primary",
                            route.active ? "text-black dark:text-white" : "text-muted-foreground"
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-62.5 sm:w-75 p-4">
                        <nav className="flex flex-col gap-4 mt-8">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "text-lg font-medium transition-colors hover:text-primary",
                                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default MainNav;