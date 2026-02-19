export function safeAvg(sum?: number | null, count?: number | null): number | null {
    if (sum == null) return null;
    if (!count || count === 0) return null;

    return sum / count;
}

export const updateMin = (current: number | null, value: number | null) =>
    value == null ? current : current == null ? value : Math.min(current, value);

export const updateMax = (current: number | null, value: number | null) =>
    value == null ? current : current == null ? value : Math.max(current, value);


export function discardNullFields(obj: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => {
            if (value === null || value === undefined) return false;
            if (typeof value === "number" && isNaN(value)) return false;
            return true;
        })
    );
}



export function discardNullFieldsDeep(obj: any): any {
    if (obj instanceof Date) {
        return obj.toISOString(); 
    }

    if (Array.isArray(obj)) {
        return obj.map(discardNullFieldsDeep);
    }

    if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, value]) => value !== null && value !== undefined)
                .map(([key, value]) => [key, discardNullFieldsDeep(value)])
                .filter(([_, value]) => value !== undefined)
        );
    }

    if (typeof obj === "number" && isNaN(obj)) return undefined;

    return obj;
}
