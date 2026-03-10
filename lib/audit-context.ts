import { AsyncLocalStorage } from "node:async_hooks"

export interface AuditContext {
    userId?: string
    ip?: string
    route?: string
    role?: string
    isAdmin?: boolean
}

const globalForAudit = global as unknown as { auditStorage: AsyncLocalStorage<AuditContext> };

export const auditStorage = globalForAudit.auditStorage || new AsyncLocalStorage<AuditContext>();

if (process.env.NODE_ENV !== "production") globalForAudit.auditStorage = auditStorage;

export function getAuditContext() {
    return auditStorage.getStore()
}