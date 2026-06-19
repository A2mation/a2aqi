import { create } from "zustand";
import { Device } from "@prisma/client";

type DeviceState = {
    devices: Device[];
    selectedDeviceId: string | null;
    selectedDeviceActiveStatus: boolean ;

    setDevices: (devices: Device[]) => void;
    selectDevice: (id: string) => void;
    setSelectedDeviceActiveStatus: (isActive: boolean) => void;
};

export const useDeviceStore = create<DeviceState>((set) => ({
    devices: [],
    selectedDeviceId: null,
    selectedDeviceActiveStatus: false,

    setDevices: (devices) => set({ devices }),
    selectDevice: (id) => set({ selectedDeviceId: id }),
    setSelectedDeviceActiveStatus: (isActive) => set({ selectedDeviceActiveStatus: isActive }),
}));