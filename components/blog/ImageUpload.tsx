'use client'


import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { FileUpload } from "../ui/file-upload";

interface DropzoneProps {
    onChange: (base64: string) => void;
    label: string;
    value?: string;
    disabled?: boolean;
    className?: string;
}

const ImageUpload: React.FC<DropzoneProps> = ({ onChange, label, value, disabled, className }) => {

    return (
        <div className="w-full flex justify-center min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={onChange} label={label} value={value} disabled={disabled} className={className} />
        </div>
    );
}

export default ImageUpload;