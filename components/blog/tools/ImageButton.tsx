"use client";

import { useState } from "react";
import { Search, UploadIcon, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/use-editor-store";
import { http } from "@/lib/http";
import toast from "react-hot-toast";

export const ImageButton = () => {
    const { editor } = useEditorStore();

    const [imageURL, setImageURL] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const onChange = (href: string) => {
        editor?.chain().focus().setImage({
            src: href,
            alt: 'image'
        }).run();
    };

    const onUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const toastId = toast.loading("Uploading image...");

            try {
                setIsUploading(true);

                const buffer = Buffer.from(await file.arrayBuffer());
                const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

                const res = await http.post("/api/blog/upload", {
                    image: base64String
                });

                onChange(res.data.url);

                toast.success("Image uploaded successfully!", { id: toastId });
            } catch (error) {
                console.error("Upload failed:", error);
                toast.error("Failed to upload image.", { id: toastId });
            } finally {
                setIsUploading(false);
            }
        };
        input.click();
    };

    const handleImageURLSubmit = () => {
        if (imageURL) {
            onChange(imageURL);
            setImageURL("");
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <Button
                onClick={onUpload}
                variant={"outline"}
                disabled={isUploading}
            >
                {isUploading ? (
                    <Loader2 className="size-4 mr-1 animate-spin" />
                ) : (
                    <UploadIcon className="size-4 mr-1" />
                )}
                {isUploading ? "Uploading..." : "Upload"}
            </Button>

            <Button onClick={() => setIsDialogOpen(true)} variant={"outline"}>
                <Search className="size-4 mr-1" />
                Search
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Insert Image URL</DialogTitle>
                        <DialogDescription>
                            Paste the direct URL to your image and click Insert.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="https://example.com/image.jpg"
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
    );
};