export function diffObjects(oldObj: any, newObj: any) {
    const changes: Record<string, any> = {}

    for (const key in newObj) {
        if (oldObj?.[key] !== newObj?.[key]) {
            changes[key] = {
                before: oldObj?.[key],
                after: newObj?.[key],
            }
        }
    }

    return changes
}