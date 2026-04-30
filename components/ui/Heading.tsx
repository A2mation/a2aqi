import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"


interface HeadingProps {
    title: string,
    description: string,
    Icon?: LucideIcon
}

const Heading = ({
    title,
    description,
    Icon
}: HeadingProps) => {
    return (
        <>
            <div>
                <h2 className="text-3xl flex flex-row items-center gap-2 font-bold text-foreground tracking-tight">
                    {title}
                    {Icon &&
                        <span>
                            <Icon className="size-8"/>
                        </span>
                    }
                </h2>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

        </>
    )
}

export default Heading