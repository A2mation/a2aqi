export const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";

    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};


export const formatDateOnly = (isoString: string) => {
    if (!isoString) return "N/A"

    const date = new Date(isoString)

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}