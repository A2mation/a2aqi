import { auditStorage, AuditContext } from "./audit-context"

export async function withAuditContext(
    context: AuditContext,
    fn: () => Promise<any>
) {
    return auditStorage.run(context, fn)
}