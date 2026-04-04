"use client"

import { create } from "zustand";
import { AQISource } from "@prisma/client";

export interface PopularCities {
    location: string;
    aqi: number;
    humidity: number | null;
    temperature: number | null;
    measuredAt: Date;
}

export interface NearbyCities {
    distanceKm: number;
    lat: number;
    lng: number;
    location: string;
    source: AQISource;
    aqi: number;
    pm25: number | null;
    pm10: number | null;
    humidity: number | null;
    id: string;
    temperature: number | null;
}

export type LocationState = {
    lat: number | null
    lng: number | null
    location: string | null
    city: string | null
    state: string | null
    country: string | null
    source: string | null
    loading: boolean
    aqi: number | null,
    pm25: number | null,
    pm10: number | null,
    no2: number | null,
    o3: number | null,
    error: string | null,
    temp: number | null,
    humidity: number | null,
    co: number | null,
    so2: number | null,
    wind: number | null,
    lastUpdated: Date | null,

    popularCities: PopularCities[]
    nearbyCities: NearbyCities[]
    graphData: GraphData[]

    setState: (data: Partial<LocationState>) => void
}

export interface GraphData {
    id: string;
    aqi: number;
    temperature: number | null;
    createdAt: Date;
}

export const useLocationStore = create<LocationState>((set) => ({
    lat: null,
    lng: null,
    location: null,
    source: null,
    state: null,
    city: null,
    country: null,
    loading: false,
    aqi: null,
    pm25: null,
    pm10: null,
    no2: null,
    o3: null,
    temp: null,
    humidity: null,
    co: null,
    so2: null,
    wind: null,
    error: null,
    lastUpdated: null,

    popularCities: [],
    nearbyCities: [],
    graphData: [],

    setState: (data) => set((state) => ({ ...state, ...data })),
}))
