import {
    ListIcon,
    ListOrderedIcon,
} from "lucide-react"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEditorStore } from "@/store/use-editor-store"
import { cn } from "@/lib/utils"



export const ListButton = () => {
    const {
        editor
    } = useEditorStore()

    const lists = [
        {
            label: "Bullet List",
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            isActive: () => editor?.isActive("orderedList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        }
    ]

    return (
        <>

            <button
                key={lists[0].label}
                onClick={lists[0].onClick}
                className={cn(
                    "flex items-center justify-between gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                    lists[0].isActive() && "bg-neutral-200/80"
                )}
            >
                <span className="text-sm" >{lists[0].label}</span>
                <ListIcon className="size-4" />
            </button>

            <button
                key={lists[1].label}
                onClick={lists[1].onClick}
                className={cn(
                    "flex items-center justify-between gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                    lists[1].isActive() && "bg-neutral-200/80"
                )}
            >
                <span className="text-sm" >{lists[1].label}</span>
                <ListOrderedIcon className="size-4" />
            </button>


        </>
    )
}
