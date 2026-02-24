export const formatFileSize = (sizeInMB: number | null) => {
    if (!sizeInMB) return "0 Bytes";

    if (sizeInMB < 0.1) {
        // If less than 0.1 MB, show in KB
        return `${(sizeInMB * 1024).toFixed(2)} KB`;
    }

    return `${sizeInMB.toFixed(2)} MB`;
};