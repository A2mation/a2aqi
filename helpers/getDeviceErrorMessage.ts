export const getDeviceErrorMessage = (error: any) => {
    if (!error) return null

    // Axios error response
    if (error.response) {
        return (
            error.response.data?.message ||
            error.response.data?.error ||
            `Error ${error.response.status}`
        )
    }

    // Network error
    if (error.request) {
        return "Network error. Please check your connection."
    }

    // Generic JS error
    return error.message || "Something went wrong"
}