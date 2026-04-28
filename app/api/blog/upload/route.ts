import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {

        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image data" }, { status: 400 });
        }

        // Upload directly to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'blog_content_images',
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}