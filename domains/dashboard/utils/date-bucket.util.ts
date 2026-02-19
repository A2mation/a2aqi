export function getMonthRange(year: number, month: number) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    return { start, end };
}

export function getYearRange(year: number) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    return { start, end };
}

export function getDayRange(dateStr: string) {
    const start = new Date(dateStr);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
}

export function getWeekRange(dateStr: string) {
    const date = new Date(dateStr);
    date.setUTCHours(0, 0, 0, 0);

    const dayOfWeek = date.getUTCDay(); // Sunday = 0

    const start = new Date(date);
    start.setUTCDate(start.getUTCDate() - dayOfWeek);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    end.setUTCHours(23, 59, 59, 999);

    return { start, end };
}
