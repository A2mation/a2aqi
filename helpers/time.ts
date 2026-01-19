export function getPreviousHourWindow() {
    const now = new Date();

    const hourEnd = new Date(now);
    hourEnd.setMinutes(0, 0, 0);

    const hourStart = new Date(hourEnd);
    hourStart.setHours(hourStart.getHours() - 1);

    return { hourStart, hourEnd };
}


export function getPreviousDayWindow() {
    const now = new Date();

    const dayEnd = new Date(now);
    dayEnd.setHours(0, 0, 0, 0);

    const dayStart = new Date(dayEnd);
    dayStart.setDate(dayStart.getDate() - 1);

    return { dayStart, dayEnd };
}

export function getTodayWindow() {
    const now = new Date()

    // Build IST midnight
    const istOffsetMinutes = 5 * 60 + 30

    const utcYear = now.getUTCFullYear()
    const utcMonth = now.getUTCMonth()
    const utcDate = now.getUTCDate()

    // Start: 00:00:01 IST
    const startOfToday = new Date(
        Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 1)
    )
    startOfToday.setUTCMinutes(startOfToday.getUTCMinutes() - istOffsetMinutes)

    // End: 23:59:59 IST
    const endOfToday = new Date(
        Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999)
    )
    endOfToday.setUTCMinutes(endOfToday.getUTCMinutes() - istOffsetMinutes)

    return { startOfToday, endOfToday }
}



export function adjustTemperature(baseTemp: number | null) {
    if (baseTemp === null) return null

    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()

    const timeInMinutes = hour * 60 + minute

    // Time ranges in minutes
    if (timeInMinutes >= 60 && timeInMinutes <= 359) {
        return baseTemp + 1
    }

    if (timeInMinutes >= 360 && timeInMinutes <= 720) {
        return baseTemp + 3
    }

    if (timeInMinutes >= 721 && timeInMinutes <= 960) {
        return baseTemp + 6
    }

    if (timeInMinutes >= 961 && timeInMinutes <= 1080) {
        return baseTemp + 3
    }

    if (timeInMinutes >= 1081 && timeInMinutes <= 1260) {
        return baseTemp + 2
    }

    if (timeInMinutes >= 1261 && timeInMinutes <= 1380) {
        return baseTemp + 1
    }

    return baseTemp
}


export function formatTime(date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
}
