export const logLocationError = (source: string, error: unknown) => {
    if (process.env.NODE_ENV === "development") {
        console.warn(`[Location][${source}] failed`, error)
    }

    // TODO: send to logging service
    // Sentry.captureException(error)
}
