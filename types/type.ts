export enum ROLE {
  ADMIN = "ADMIN",
  WRITER = "WRITER",
  USER = "USER"
}


export interface Author {
    name: string
    username: string
    email: string
}

export interface BlogContentProps {
    id: string;
    createdAt: Date
    updatedAt: Date
    slug: string
    title: string
    desc: string
    img?: string
    views?: number
    authorId: string
    likesCount: number
    likedIds: []
    author: Author
}

export interface ExportLog {
    id: string
    deviceId: string
    status: "COMPLETED" | "PROCESSING" | "FAILED"
    requestedAt: string
    completedAt: string | null
    format: "CSV" | "PDF" | "EXCEL"
    fileSize: number | null
    fileUrl: string | null
    fromDate: string | null
    toDate: string | null
    metadata: any | null
    errorMessage: string | null
    device: {
        name: string
    } | null
}