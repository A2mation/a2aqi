import { AsyncLocalStorage } from "node:async_hooks"

export interface AuditContext {
    userId?: string
    ip?: string
    route?: string
}

export const auditStorage = new AsyncLocalStorage<AuditContext>()

export function getAuditContext() {
    return auditStorage.getStore()
}