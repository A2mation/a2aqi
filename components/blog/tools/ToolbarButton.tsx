import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
    lable: string
    icon: LucideIcon;
    onClick?: () => void;
    isActive?: boolean;
}

export const ToolbarButton = ({
    lable,
    icon: Icon,
    onClick,
    isActive
}: ToolbarButtonProps) => {
    return (
        <button
            className={cn(
                "text-sm min-w-7 flex items-center justify-between h-7 p-2 rounded-sm hover:bg-neutral-300/80",
                isActive && "bg-neutral-300/80"
            )}
            onClick={onClick}
        >
            {lable}
            <Icon className='size-4' />
        </button>
    )
};