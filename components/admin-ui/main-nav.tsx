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
            href: `/admin/device-model`,
            label: 'Device Models',
            active: pathName === `/admin/device-model` || pathName === `/admin/device-model/new` || pathName === `/admin/device-model/${params.deviceModelId}`
        },
        {
            href: `/admin/device`,
            label: 'Devices',
            active: pathName === `/admin/device` || pathName === `/admin/device/new` || pathName === `/admin/device/${params.deviceId}`
        },
        {
            href: `/admin/sensors`,
            label: 'Sensors',
            active: pathName === `/admin/sensors`|| pathName === `/admin/sensors/new` || pathName === `/admin/sensors/${params.sensorId}`
        },
        {
            href: `/admin/aqi`,
            label: 'AQI',
            active: pathName === `/admin/aqi` || pathName === `/admin/aqi/new` || pathName === `/admin/aqi/${params.aqiId}`
        },
        {
            href: `/admin/blogs`,
            label: 'Blogs',
            active: pathName === `/admin/blogs` || pathName === `/admin/blogs/new` || pathName === `/admin/blogs/${params.blogId}`
        },
        {
            href: `/admin/writer`,
            label: 'Writer',
            active: pathName === `/admin/writer` || pathName === `/admin/writer/new` || pathName === `/admin/writer/${params.writerId}`
        },
        {
            href: `/admin/settings`,
            label: 'Settings',
            active: pathName === `/admin/settings` || pathName === `/admin/settings/new` || pathName === `/admin/settings/${params.settingId}`
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