"use client"

import { create } from "zustand"

export type LocationState = {
    lat: number | null
    lng: number | null
    city: string | null
    state: string | null
    country: string | null
    source: string | null
    loading: boolean | null
    error: string | null,
    lastUpdated: Date | null,  

    setState: (data: Partial<LocationState>) => void
}

export const useLocationStore = create<LocationState>((set) => ({
    lat: null,
    lng: null,
    source: null,
    state: null,
    city: null,
    country: null,
    loading: false,
    error: null,
    lastUpdated: null,

    setState: (data) => set((state) => ({ ...state, ...data })),
}))
