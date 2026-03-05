import { PrismaClient } from "@prisma/client"
import { createAuditExtension } from "./prisma-audit"

const prismaClientSingleton = () => {

    const client = new PrismaClient()

    return client.$extends(createAuditExtension(client))
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma =
    globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma
}