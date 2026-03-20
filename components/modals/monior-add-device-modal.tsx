"use client"

import { useEffect, useState } from 'react'

import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface AddDeviceModalProps {
    isOpen: boolean
    onClose: () => void
    loading?: boolean
}

const AddDeviceModal = ({
    isOpen,
    onClose,
    loading
}: AddDeviceModalProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [serialNo, setSerialNo] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, [])

    // Reset the input field whenever the modal is closed/opened
    useEffect(() => {
        if (!isOpen) {
            setSerialNo("");
        }
    }, [isOpen]);

    const onSubmit = () => {
        if (!serialNo.trim()) return;
        console.log(serialNo)
    }

    if (!isMounted) {
        return null;
    }

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
                        disabled={loading}
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
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={loading || !serialNo.trim()}
                    onClick={onSubmit}
                >
                    Register Device
                </Button>
            </div>
        </Modal>
    )
}

export default AddDeviceModal