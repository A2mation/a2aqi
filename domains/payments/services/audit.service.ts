import { AuditAction, AuditActorType } from "@prisma/client"
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
 * Utility to determine current actor identity and role from context
 */
export function getActorDetails(fallbackType: AuditActorType = AuditActorType.SYSTEM) {
    const ctx = getAuditContext();

    // fallback (SYSTEM or WEBHOOK)
    let actorType: AuditActorType = fallbackType;
    let actorId = ctx?.userId ?? "SYSTEM";

    // Check if context contains a user (Admin or standard User)
    if (ctx?.userId) {
        actorType = ctx.isAdmin ? AuditActorType.ADMIN : AuditActorType.USER;
    }
    // If no user, but the route indicates a webhook path
    else if (ctx?.route === "razorpay-webhook") {
        actorType = AuditActorType.WEBHOOK;
        actorId = "WEBHOOK_HANDLER";
    }

    return {
        actorId,
        actorType,
        ip: ctx?.ip,
        route: ctx?.route
    };
}


/**
 * Generic audit logger
*/
export async function createAuditLog(data: AuditLogInput) {
    const { actorId, actorType, ip, route } = getActorDetails();

    return createAuditLogRecord({
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        actorId,
        actorType,
        ip,
        route,
        oldData: data.oldData ?? null,
        newData: data.newData ?? null
    });
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