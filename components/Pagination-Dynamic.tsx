"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import { ChevronRight, LayoutDashboard } from "lucide-react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

interface Props {
    items: string[]
}

const DynamicPagination = ({ items }: Props) => {
    const pathname = usePathname()

    if (!items || items.length === 0) {
        return null
    }

    const isDashboardActive = pathname.startsWith("/dashboard")

    return (
        <Pagination>
            <PaginationContent className="flex items-center justify-center">

                <PaginationItem>
                    <PaginationLink
                        href="/dashboard"
                        size="lg"
                        className={clsx(
                            "p-4 md:text-xl flex items-center gap-2",
                            isDashboardActive && "text-blue-500 font-semibold",
                            "hover:bg-inherit hover:text-blue-400"
                        )}
                    >
                        <LayoutDashboard size={25} className="h-8 w-8" />
                        Dashboard
                    </PaginationLink>
                </PaginationItem>

              
                <PaginationItem className="pointer-events-none">
                    <ChevronRight size={16} />
                </PaginationItem>

            
                {items.map((item, index) => {
                    const href = `/dashboard/${item}`
                    const isActive = pathname.startsWith(href)

                    return (
                        <PaginationItem key={item} className="flex items-center">

                            <PaginationLink
                                href={href}
                                size="lg"
                                className={clsx(
                                    "p-4 md:text-xl",
                                    isActive && "text-blue-600 font-semibold",
                                    "hover:bg-inherit hover:text-blue-400"
                                )}
                            >
                                {item}
                            </PaginationLink>

                            
                            {index < items.length - 1 && (
                                <ChevronRight size={16} />
                            )}

                        </PaginationItem>
                    )
                })}

            </PaginationContent>
        </Pagination>
    )
}

export default DynamicPagination
