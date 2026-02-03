"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

const MainNav = ({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {

    const pathName = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/admin`,
            label: 'Overview',
            active: pathName === `/admin`
        },
        {
            href: `/admin/sensors`,
            label: 'Sensors',
            active: pathName === `/admin/sensors`
        },
        {
            href: `/admin/aqi`,
            label: 'AQI',
            active: pathName === `/admin/aqi`
        },
        {
            href: `/admin/blogs`,
            label: 'Blogs',
            active: pathName === `/admin/blogs`
        },
        {
            href: `/admin/writer`,
            label: 'Writer',
            active: pathName === `/admin/writer`
        },
        {
            href: `/admin/settings`,
            label: 'Settings',
            active: pathName === `/admin/settings`
        }
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-base font-semibold transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav