'use client'

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { getDeviceErrorMessage } from "@/helpers/getDeviceErrorMessage"

export const useDeviceLookup = (serialNo: string, setValue: any) => {
    const [debouncedId, setDebouncedId] = useState("")

    /* ===============================
       DEBOUNCE
    =============================== */

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedId(serialNo)
        }, 800)

        return () => clearTimeout(handler)
    }, [serialNo])

    /* ===============================
       QUERY
    =============================== */

    const query = useQuery({
        queryKey: ["device-model-by-id", debouncedId],
        queryFn: async () => {
            const response = await http.get(
                `/api/user/device/${debouncedId}`
            )

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Error")
            }

            return response.data
        },
        enabled: !!debouncedId && debouncedId.length >= 2,
        retry: false,
    })

    const errorMessage = getDeviceErrorMessage(query.error)
    const isError = !!errorMessage
    const isFetching = query.isFetching
    const isFound = !!query.data?.model?.id

    /* ===============================
       SET MODEL ID
    =============================== */

    useEffect(() => {
        if (isFound) {
            setValue("modelId", query.data.model.id)
        }
    }, [isFound, setValue])

    /* ===============================
       CLEAR MODEL ON ERROR
    =============================== */

    useEffect(() => {
        if (isError) {
            setValue("modelId", "")
        }
    }, [isError, setValue])

    return {
        isFetching,
        isFound,
        isError,
        errorMessage,
    }
}