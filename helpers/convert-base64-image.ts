import path from "path";
import fs from 'fs'

export const getBase64Image = (filePath: string): string => {
    try {
        const fullPath = path.resolve(/*turbopackIgnore: true*/process.cwd(), filePath);
        const image = fs.readFileSync(fullPath);
        const extension = path.extname(filePath).replace('.', '');
        return `data:image/${extension};base64,${image.toString('base64')}`;
    } catch (error) {
        console.log(error)
        console.warn("Could not find logo file, using empty string.");
        return "";
    }
};