"use client"

import { useEffect, useState } from "react";

import { DeviceModal } from "@/components/modals/device-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState<Boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DeviceModal />
        </>
    )
}