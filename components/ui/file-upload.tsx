"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import { motion } from "motion/react"
import { IconUpload } from "@tabler/icons-react"
import { useDropzone } from "react-dropzone"

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
}

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

interface DropzoneProps {
  onChange: (base64: string) => void
  label: string
  value?: string
  disabled?: boolean
  className?: string
}

export const FileUpload = ({
  onChange,
  label,
  value,
  disabled,
  className,
}: DropzoneProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [base64, setBase64] = useState<string | undefined>(value)

  // keep preview in sync with parent
  useEffect(() => {
    setBase64(value)
  }, [value])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return

      const file = acceptedFiles[0]
      setFiles(acceptedFiles)

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setBase64(result)
        onChange(result)
      }
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxFiles: 1,
    disabled,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
  })

  return (
    <div className={cn("w-full", className)} {...getRootProps()}>
      <motion.div
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input {...getInputProps()} />

        {/* background grid */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-bold text-neutral-700 dark:text-neutral-300">
            Upload file
          </p>
          <p className="relative z-20 text-neutral-400 mt-2">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {/* preview */}
            {base64 ? (
              <div className="flex justify-center">
                <Image
                  src={base64}
                  height={160}
                  width={160}
                  alt="Uploaded image"
                  className="rounded-md object-contain"
                />
              </div>
            ) : (
              <>
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop it
                      <IconUpload className="h-4 w-4" />
                    </motion.p>
                  ) : (
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>

                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                />
              </>
            )}

            {/* file info */}
            {files.length > 0 &&
              files.map((file) => (
                <motion.div
                  key={file.name}
                  layoutId="file-upload-info"
                  className="relative z-40 bg-white dark:bg-neutral-900 p-4 mt-4 rounded-md shadow-sm"
                >
                  <div className="flex justify-start flex-col text-sm text-neutral-600 dark:text-neutral-300">
                    <div className="truncate">Name : {file.name}</div>
                    <div>
                      Size : 
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function GridPattern() {
  const columns = 41
  const rows = 11

  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-wrap justify-center gap-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => (
          <div
            key={`${col}-${row}`}
            className="w-10 h-10 rounded-[2px] bg-gray-50 dark:bg-neutral-950"
          />
        ))
      )}
    </div>
  )
}
