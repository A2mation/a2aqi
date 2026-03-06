import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

/**
 * Create Audit Log
 */
export async function createAuditLogRecord(
    data: Prisma.AuditLogCreateInput
) {
    return prisma.auditLog.create({
        data
    })
}

/**
 * Get Audit Log by ID
 */
export async function getAuditLogById(id: string) {
    return prisma.auditLog.findUnique({
        where: { id }
    })
}

/**
 * Get Audit Logs for Entity
 */
export async function getAuditLogsByEntity(
    entityType: string,
    entityId: string
) {
    return prisma.auditLog.findMany({
        where: {
            entityType,
            entityId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

/**
 * Get Audit Logs by Actor
 */
export async function getAuditLogsByActor(actorId: string) {
    return prisma.auditLog.findMany({
        where: {
            actorId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

/**
 * List Audit Logs (Admin)
 */
export async function listAuditLogs(
    page = 1,
    limit = 50
) {
    const skip = (page - 1) * limit

    return prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    })
}