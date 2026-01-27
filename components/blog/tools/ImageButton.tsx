"use client"

import { useState } from "react"
import { ImageIcon, Link2Icon, Search, UploadIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/use-editor-store"

export const ImageButton = () => {
    const {
        editor
    } = useEditorStore();

    const [imageURL, setImageURL] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onChange = (href: string) => {
        editor?.chain().focus().setImage({
            src: href,
            alt: 'image'
        }).run();
    }

    const onUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imgUrl = URL.createObjectURL(file);
                onChange(imgUrl);
            }
        }

        input.click();
    }

    const handleImageURLSubmit = () => {
        if (imageURL) {
            onChange(imageURL);
            setImageURL("");
            setIsDialogOpen(false);
        }
    }

    return (
        <>

            <Button onClick={onUpload} variant={"outline"}>
                <UploadIcon className="size-4 mr-1" />
                Upload
            </Button>
            <Button onClick={() => setIsDialogOpen(true)} variant={"outline"}>
                <Search className="size-4 mr-1" />
                Search
            </Button>




            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Insert Img URL</DialogTitle>
                        <DialogDescription>
                            Upload any image here. Click Insert you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="https://www.google.com/"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleImageURLSubmit()}
                    />

                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={handleImageURLSubmit}
                        >
                            Insert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

