"use client"

import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { http } from '@/lib/http'

interface AddDeviceModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
}

const AddDeviceModal = ({
    isOpen,
    onClose,
    loading
}: AddDeviceModalProps) => {
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);
    const [serialNo, setSerialNo] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { mutate: registerDevice, isPending } = useMutation({
        mutationFn: async (newSerial: string) => {
            const response = await http.post('/api/monitor/device/register-device', {
                serialNo: newSerial
            });
            if(!response.data.success) {
                throw new Error(response.data.message || "Failed to register device");
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            toast.success("Device registered successfully!");
            setSerialNo("");
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to register device");
            console.error("Registration failed:", error);
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setSerialNo("");
        }
    }, [isOpen]);

    const onSubmit = () => {
        if (!serialNo.trim()) return;
        registerDevice(serialNo);
    }

    if (!isMounted) return null;

    return (
        <Modal
            title='Add New Device'
            description='Enter the device details to register it to your account.'
            isOpen={isOpen}
            onClose={onClose}
            activeProfileIcon={false}
        >
            <div className='space-y-4 py-2 pb-4'>
                <div className='space-y-2'>
                    <Label htmlFor="serialNo">Device Serial Number</Label>
                    <Input
                        id="serialNo"
                        disabled={isPending}
                        placeholder="e.g. SN-9921-X"
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                    />
                    <p className='text-[10px] text-muted-foreground'>
                        The serial number can be found on the sticker at the back of the device.
                    </p>
                </div>
            </div>
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button
                    disabled={isPending}
                    variant="outline"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isPending || !serialNo.trim() || loading}
                    onClick={onSubmit}
                >
                    {isPending ? "Registering..." : "Register Device"}
                </Button>
            </div>
        </Modal>
    )
}

export default AddDeviceModal;