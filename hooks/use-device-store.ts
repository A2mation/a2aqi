import { create } from "zustand";

interface useDeviceStoreInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useDeviceModal = create<useDeviceStoreInterface>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));