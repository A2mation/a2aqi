type NormalizedUser = {
    id: string;
    role: "ADMIN" | "WRITER" | "USER";
    accessToken: string;
};

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
    author: Author
}