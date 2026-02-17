export function safeAvg(sum?: number | null, count?: number | null): number | null {
    if (sum == null) return null;
    if (!count || count === 0) return null;

    return sum / count;
}

export const updateMin = (current: number | null, value: number | null) =>
    value == null ? current : current == null ? value : Math.min(current, value);

export const updateMax = (current: number | null, value: number | null) =>
    value == null ? current : current == null ? value : Math.max(current, value);
