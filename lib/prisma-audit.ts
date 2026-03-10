import { Prisma, PrismaClient, AuditAction } from "@prisma/client"
import { diffObjects } from "@/utils/object-diff"
import { createAuditLog, getActorDetails } from "@/domains/payments/services/audit.service"
import { getAuditContext } from "./audit-context"

const TRACKED_MODELS = [
    "Payment",
    "DeviceSubscription",
    "Coupon",
    "Invoice"
] as const

const MUTATIONS = [
    "create", "update", "delete", "upsert",
    "createMany", "updateMany", "deleteMany"
] as const

type MutationOperation = typeof MUTATIONS[number]


function getDelegate(prisma: PrismaClient, model: string) {

    const key = model.charAt(0).toLowerCase() + model.slice(1)


    const client = prisma as unknown as Record<string, unknown>
    const delegate = client[key]

    if (
        delegate == null ||
        typeof delegate !== "object" ||
        !("findUnique" in delegate) ||
        typeof (delegate as Record<string, unknown>).findUnique !== "function"
    ) {
        console.warn(`[audit] Delegate not found or missing findUnique for model: "${key}"`)
        return null
    }

    return delegate as {
        findUnique: (args: { where: unknown }) => Promise<Record<string, unknown> | null>
    }
}

export const createAuditExtension = (prisma: PrismaClient) =>
    Prisma.defineExtension({

        name: "audit-extension",

        query: {

            $allModels: {

                async $allOperations<T, A>({
                    model,
                    operation,
                    args,
                    query,
                }: {
                    model?: string
                    operation: string
                    args: A
                    query: (args: A) => Prisma.PrismaPromise<T>
                }): Promise<T> {

                    if (!model) return query(args)

                    if (!TRACKED_MODELS.includes(model as typeof TRACKED_MODELS[number])) {
                        return query(args)
                    }

                    if (!MUTATIONS.includes(operation as MutationOperation)) {
                        return query(args)
                    }

                    const mutationOp = operation as MutationOperation
                    const argsRecord = args as Record<string, unknown>

                    let oldData: Record<string, unknown> | null = null


                    if (
                        ["update", "delete", "upsert"].includes(mutationOp) &&
                        argsRecord?.where
                    ) {
                        try {
                            const delegate = getDelegate(prisma, model)
                            if (delegate) {
                                oldData = await delegate.findUnique({ where: argsRecord.where })
                            }
                        } catch (err) {
                            console.warn("[audit] oldData fetch failed:", err)
                        }
                    }

                    const result = await query(args)
                    const resultRecord = result as Record<string, unknown> | null

                    const { actorId, actorType } = getActorDetails();

                    if (actorType === "SYSTEM") {
                        console.warn(`[audit] No user context for ${operation} on ${model} — logging as SYSTEM`);
                    } else {
                        console.log(`[audit] ${actorType} (${actorId}) is performing ${operation} on ${model}`);
                    }

                    let action: AuditAction = mapAction(mutationOp)
                    if (mutationOp === "upsert") {
                        action = oldData ? AuditAction.UPDATE : AuditAction.CREATE
                    }


                    const isUpdate = mutationOp === "update" || (mutationOp === "upsert" && !!oldData)
                    const newData = isUpdate ? diffObjects(oldData, result) : result
                    const storedOld = isUpdate ? oldData : null

                    try {
                        await createAuditLog({
                            entityType: model,
                            entityId: (
                                resultRecord?.id ??
                                (argsRecord?.where as Record<string, unknown>)?.id ??
                                "UNKNOWN"
                            ) as string,
                            action,
                            oldData: storedOld as Prisma.InputJsonValue | null,
                            newData: newData as Prisma.InputJsonValue | null
                        })
                    } catch (err) {
                        console.error("[audit] Failed to write audit log:", err)
                    }

                    return result
                }
            }
        }
    })

function mapAction(operation: MutationOperation): AuditAction {
    switch (operation) {
        case "create":
        case "createMany":
            return AuditAction.CREATE

        case "update":
        case "updateMany":
        case "upsert":
            return AuditAction.UPDATE

        case "delete":
        case "deleteMany":
            return AuditAction.DELETE

        default: {
            const _exhaustive: never = operation
            throw new Error(`Unhandled audit operation: ${_exhaustive}`)
        }
    }
}