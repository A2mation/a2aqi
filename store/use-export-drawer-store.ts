import { create } from "zustand"

type AggregationType = "hourly" | "daily"

interface DateRange {
    from?: Date
    to?: Date
}

interface ExportDrawerState {
    isOpen: boolean
    deviceId?: string
    type: AggregationType
    dateRange?: DateRange

    openDrawer: (payload?: {
        deviceId?: string
        type?: AggregationType
        dateRange?: DateRange
    }) => void

    closeDrawer: () => void
    reset: () => void
}

const initialState = {
    isOpen: false,
    deviceId: undefined,
    type: "hourly" as AggregationType,
    dateRange: undefined,
}

export const useExportDrawerStore = create<ExportDrawerState>(
    (set) => ({
        ...initialState,

        openDrawer: (payload) =>
            set((state) => ({
                isOpen: true,
                deviceId: payload?.deviceId ?? state.deviceId,
                type: payload?.type ?? state.type,
                dateRange: payload?.dateRange ?? state.dateRange,
            })),

        closeDrawer: () =>
            set({
                isOpen: false,
            }),

        reset: () =>
            set({
                ...initialState,
            }),
    })
)