import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

/**
 * UPLOADS a file to S3
 * For invoices, always pass 'application/pdf' as the contentType
 */
export async function uploadToS3(folder: string, file: Buffer, fileName: string, contentType: string) {
    const key = `${folder}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType, // Critical for browser viewing
    });

    await s3Client.send(command);
    return key; // Return the 'Key' to save in your database
}

/**
 * GENERATES a temporary viewing link
 * Since your bucket is private, use this to show the invoice to the user
 */
export async function getInvoiceUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    // Link expires in 1 hour (3600 seconds)
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * DELETES a file from S3
 */
export async function deleteFromS3(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    return await s3Client.send(command);
}