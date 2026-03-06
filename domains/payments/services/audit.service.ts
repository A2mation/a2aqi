import { AuditAction } from "@prisma/client"
import { getAuditContext } from "@/lib/audit-context"

import {
    createAuditLogRecord,
    getAuditLogsByEntity,
    getAuditLogsByActor,
    listAuditLogs
} from "../repositories/audit.repo"

interface AuditLogInput {
    entityType: string
    entityId: string
    action: AuditAction
    oldData?: any
    newData?: any
}

/**
 * Generic audit logger
 */
export async function createAuditLog(data: AuditLogInput) {

    const ctx = getAuditContext()

    return createAuditLogRecord({
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        actorId: ctx?.userId ?? "SYSTEM",
        actorType: ctx?.userId ? "USER" : "SYSTEM",
        oldData: data.oldData ?? null,
        newData: data.newData ?? null
    })
}

/**
 * Log CREATE action
 */
export async function logCreate(entityType: string, entityId: string, data: any) {
    return createAuditLog({
        entityType,
        entityId,
        action: "CREATE",
        newData: data
    })
}

/**
 * Log UPDATE action
 */
export async function logUpdate(
    entityType: string,
    entityId: string,
    oldData: any,
    newData: any
) {
    return createAuditLog({
        entityType,
        entityId,
        action: "UPDATE",
        oldData,
        newData
    })
}

/**
 * Log DELETE action
 */
export async function logDelete(
    entityType: string,
    entityId: string,
    oldData: any
) {
    return createAuditLog({
        entityType,
        entityId,
        action: "DELETE",
        oldData
    })
}

/**
 * Log system event (webhooks, cron jobs)
 */
export async function logSystemEvent(
    entityType: string,
    entityId: string,
    action: AuditAction,
    data?: any
) {

    return createAuditLogRecord({
        entityType,
        entityId,
        action,
        actorId: "SYSTEM",
        actorType: "SYSTEM",
        newData: data ?? null
    })
}

/**
 * Get entity audit timeline
 */
export async function getEntityTimeline(
    entityType: string,
    entityId: string
) {
    return getAuditLogsByEntity(entityType, entityId)
}

/**
 * Get user activity
 */
export async function getUserAuditHistory(userId: string) {
    return getAuditLogsByActor(userId)
}

/**
 * Get recent activity for admin dashboard
 */
export async function getRecentActivity(limit = 20) {
    return listAuditLogs(1, limit)
}

/**
 * Search audit logs
 */
export async function searchAuditLogs(
    entityType: string,
    entityId: string
) {
    return getAuditLogsByEntity(entityType, entityId)
}