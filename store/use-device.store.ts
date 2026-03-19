import { Device } from "@prisma/client";
import { create } from "zustand";

type DeviceState = {
    devices: Device[];
    selectedDeviceId: string | null;

    setDevices: (devices: Device[]) => void;
    selectDevice: (id: string) => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
    devices: [],
    selectedDeviceId: null,

    setDevices: (devices) => set({ devices }),
    selectDevice: (id) => set({ selectedDeviceId: id }),
}));