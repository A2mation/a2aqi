"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/blog/ImageUpload"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import BlogEditor from "@/components/blog/BlogEditor"
import { useEditorStore } from "@/store/use-editor-store"
import { MultiSelect } from "@/components/ui/multi-select"
import { Category } from "@/store/category.store"



interface CategoriesProps {
  id: string
  slug: string
  title: string
  img?: string
  post?: []
}




const titleChecker = (data: string) => data.length >= 5
const blogChecker = (data: string) => data.length >= 50

const WriteYourBlogPage = () => {
  const {
    editor
  } = useEditorStore();
  const router = useRouter();
  const [tags, setTags] = useState<Category[]>([])
  const [blog, setBlog] = useState("")
  const [title, setTitle] = useState("")
  const [img, setImg] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!titleChecker(title)) {
      toast.error("Title length must be greater than five.")
      setIsLoading(false)
      return
    }

    if (!blogChecker(blog)) {
      toast.error("Blog length must be greater than 50 words.")
      setIsLoading(false)
      return
    }

    if (tags.length === 0) {
      toast.error("One category must be selected")
      setIsLoading(false)
      return
    }

    try {
      await axios.post("/api/blog", {
        tags,
        img,
        title,
        blog,
      })

      toast.success("Post Created Successfully")
      router.refresh();
      
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }


  console.log(blog)
  return (
    <div className="border my-4 rounded-md">
      <div className="p-4 border-b">
        <h1 className="font-semibold text-3xl flex ">Add New Blog <Plus size={30} /> </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Category */}
        <MultiSelect
          value={tags}
          onChange={setTags}
        />


        {/* Thumbnail */}
        <div>
          <Label className="py-5 text-2xl">Thumbnail Image</Label>
          <ImageUpload
            value={img}
            onChange={setImg}
            label="Upload image"
            className="w-fit"
          />
        </div>

        {/* Title */}
        <div>
          <Label className="py-5 text-2xl">Title</Label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your story..."
            className="w-full border rounded-md p-4"
          />
        </div>

        {/* Blog Body */}
        <div>
          <Label className="py-5 text-2xl">Blog Content</Label>
          <BlogEditor
            value={blog}
            onChange={setBlog}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="outline" disabled={isLoading} className="hover:cursor-pointer">
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default WriteYourBlogPage
